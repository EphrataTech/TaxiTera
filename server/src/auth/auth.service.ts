import { Injectable, UnauthorizedException, ConflictException, Logger, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { EmailVerificationService } from './email-verification.service';
import { EmailService } from './email.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private users: UsersService, 
    private jwt: JwtService,
    private emailVerification: EmailVerificationService,
    private emailService: EmailService
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
      
      // Send welcome email
      try {
        await this.emailService.sendWelcomeEmail(dto.email, dto.name);
      } catch (error) {
        this.logger.error(`Failed to send welcome email: ${error.message}`);
      }
      
      // Return token immediately for better UX
      return this.issueToken(user.id, user.name, user.email);
    } catch (error) {
      this.logger.error(`Registration failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  async login(dto: LoginDto) {
    const user = await this.users.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }
    
    const ok = await this.users.validatePassword(user, dto.password);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    return this.issueToken(user.id, user.name, user.email);
  }

  async forgotPassword(email: string) {
    const user = await this.users.findByEmail(email);
    if (!user) {
      return { message: 'If email exists, reset link has been sent' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000);
    
    await this.users.setPasswordResetToken(user.id, resetToken, resetExpires);
    
    // Send actual email
    try {
      await this.emailService.sendPasswordResetEmail(email, resetToken);
    } catch (error) {
      this.logger.error(`Failed to send reset email: ${error.message}`);
    }
    
    return { message: 'If email exists, reset link has been sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.users.findByPasswordResetToken(token);
    if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    await this.users.updatePassword(user.id, newPassword);
    await this.users.clearPasswordResetToken(user.id);
    
    return { message: 'Password reset successful' };
  }

  private issueToken(id: string, name: string, email: string) {
    const payload = { sub: id, name, email };
    const accessToken = this.jwt.sign(payload);
    return { access_token: accessToken, user: { id, name, email } };
  }
}