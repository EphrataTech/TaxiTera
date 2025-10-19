import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private users: UsersService, private jwt: JwtService) {}

  async register(dto: { name: string; email: string; password: string; phone?: string }) {
    try {
      this.logger.log(`Registration attempt for email: ${dto.email}`);
      
      const existing = await this.users.findByEmail(dto.email);
      if (existing) {
        this.logger.warn(`Email already exists: ${dto.email}`);
        throw new ConflictException('Email already in use');
      }
      
      const user = await this.users.createUser(dto.name, dto.email, dto.password, dto.phone);
      this.logger.log(`User created successfully: ${user.id}`);
      
      return this.issueToken(user.id, user.name, user.email);
    } catch (error) {
      this.logger.error(`Registration failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  async login(dto: { email: string; password: string }) {
    try {
      this.logger.log(`Login attempt for email: ${dto.email}`);
      
      const user = await this.users.findByEmail(dto.email);
      if (!user) {
        this.logger.warn(`User not found: ${dto.email}`);
        throw new UnauthorizedException('Invalid credentials');
      }
      
      const ok = await this.users.validatePassword(user, dto.password);
      if (!ok) {
        this.logger.warn(`Invalid password for: ${dto.email}`);
        throw new UnauthorizedException('Invalid credentials');
      }
      
      this.logger.log(`Login successful for: ${dto.email}`);
      return this.issueToken(user.id, user.name, user.email);
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`);
      throw error;
    }
  }



  private issueToken(id: string, name: string, email: string) {
    const payload = { sub: id, name, email };
    const accessToken = this.jwt.sign(payload);
    return { access_token: accessToken, user: { id, name, email } };
  }
}