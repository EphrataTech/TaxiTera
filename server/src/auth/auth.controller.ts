import { Body, Controller, Post, Get, Req, Res, UseGuards, Logger, UsePipes, ValidationPipe, Query, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { EmailVerificationService } from './email-verification.service';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  
  constructor(
    private auth: AuthService,
    private emailVerification: EmailVerificationService
  ) {
    this.logger.log('AuthController initialized');
  }

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  register(@Body() registerDto: RegisterDto) {
    this.logger.log('Register endpoint called');
    return this.auth.register(registerDto);
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  login(@Body() loginDto: LoginDto) {
    this.logger.log('Login endpoint called');
    return this.auth.login(loginDto);
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Verification token is required');
    }
    return this.emailVerification.verifyEmail(token);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    return this.auth.forgotPassword(body.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    return this.auth.resetPassword(body.token, body.newPassword);
  }

  @Get('test')
  test() {
    this.logger.log('Test endpoint called');
    return { message: 'Auth controller is working!', timestamp: new Date().toISOString() };
  }
}