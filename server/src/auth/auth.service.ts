import { Injectable, UnauthorizedException, ConflictException, Logger, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { EmailVerificationService } from './email-verification.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private users: UsersService, 
    private jwt: JwtService,
    private emailVerification: EmailVerificationService
  ) {}

  async register(dto: RegisterDto) {
    try {
      this.logger.log(`Registration attempt for email: ${dto.email}`);
      
      const existing = await this.users.findByEmail(dto.email);
      if (existing) {
        this.logger.warn(`Email already exists: ${dto.email}`);
        throw new ConflictException('Email already in use');
      }
      
      const user = await this.users.createUser(dto.name, dto.email, dto.password, dto.phone);
      this.logger.log(`User created successfully: ${user.id}`);
      
      // Generate and send email verification
      const verificationToken = this.emailVerification.generateVerificationToken();
      await this.users.setVerificationToken(user.id, verificationToken);
      await this.emailVerification.sendVerificationEmail(dto.email, verificationToken);
      
      return {
        message: 'Registration successful. Please check your email to verify your account.',
        user: { id: user.id, name: user.name, email: user.email, isEmailVerified: false }
      };
    } catch (error) {
      this.logger.error(`Registration failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  async login(dto: LoginDto) {
    try {
      this.logger.log(`Login attempt for email: ${dto.email}`);
      
      const user = await this.users.findByEmail(dto.email);
      if (!user) {
        this.logger.warn(`User not found: ${dto.email}`);
        throw new UnauthorizedException('Invalid credentials');
      }
      
      if (!user.isActive) {
        this.logger.warn(`Inactive user login attempt: ${dto.email}`);
        throw new UnauthorizedException('Account is deactivated');
      }
      
      const ok = await this.users.validatePassword(user, dto.password);
      if (!ok) {
        this.logger.warn(`Invalid password for: ${dto.email}`);
        throw new UnauthorizedException('Invalid credentials');
      }
      
      if (!user.isEmailVerified && process.env.NODE_ENV === 'production') {
        this.logger.warn(`Unverified email login attempt: ${dto.email}`);
        throw new BadRequestException('Please verify your email before logging in');
      }
      
      if (!user.isEmailVerified && process.env.NODE_ENV !== 'production') {
        this.logger.warn(`Development mode: allowing unverified email login for ${dto.email}`);
      }
      
      this.logger.log(`Login successful for: ${dto.email}`);
      return this.issueToken(user.id, user.name, user.email);
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`);
      throw error;
    }
  }



  async forgotPassword(email: string) {
    try {
      this.logger.log(`Password reset request for: ${email}`);
      
      const user = await this.users.findByEmail(email);
      if (!user) {
        // Don't reveal if email exists or not
        return { message: 'If the email exists, a reset link has been sent.' };
      }
      
      const resetToken = this.emailVerification.generateVerificationToken();
      await this.users.setResetToken(user.id, resetToken);
      await this.emailVerification.sendPasswordResetEmail(email, resetToken);
      
      return { message: 'If the email exists, a reset link has been sent.' };
    } catch (error) {
      this.logger.error(`Password reset failed: ${error.message}`);
      throw error;
    }
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      this.logger.log('Password reset attempt with token');
      
      const user = await this.users.findByResetToken(token);
      if (!user) {
        throw new BadRequestException('Invalid or expired reset token');
      }
      
      await this.users.updatePassword(user.id, newPassword);
      await this.users.clearResetToken(user.id);
      
      return { message: 'Password reset successful' };
    } catch (error) {
      this.logger.error(`Password reset failed: ${error.message}`);
      throw error;
    }
  }

  private issueToken(id: string, name: string, email: string) {
    const payload = { sub: id, name, email };
    const accessToken = this.jwt.sign(payload);
    return { access_token: accessToken, user: { id, name, email } };
  }
}