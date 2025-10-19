import { Body, Controller, Post, Get, Req, Res, UseGuards, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  
  constructor(private auth: AuthService) {
    this.logger.log('AuthController initialized');
  }

  @Post('register')
  register(@Body() body: { name: string; email: string; password: string; phone?: string }) {
    this.logger.log('Register endpoint called');
    return this.auth.register(body);
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    this.logger.log('Login endpoint called');
    return this.auth.login(body);
  }

  @Get('test')
  test() {
    this.logger.log('Test endpoint called');
    return { message: 'Auth controller is working!', timestamp: new Date().toISOString() };
  }
}