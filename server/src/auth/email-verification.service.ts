import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailVerificationService {
  private readonly logger = new Logger(EmailVerificationService.name);

  constructor(private usersService: UsersService) {}

  generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    // In production, integrate with email service (SendGrid, AWS SES, etc.)
    this.logger.log(`Email verification token for ${email}: ${token}`);
    this.logger.warn('Email service not configured. Token logged for development.');
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const resetUrl = `${clientUrl}/reset-password/${token}`;
    
    // Try to send real email if configured
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });
        
        await transporter.sendMail({
          from: `"TaxiTera" <${process.env.SMTP_USER}>`,
          to: email,
          subject: 'TaxiTera - Reset Your Password',
          text: `Reset Your Password\n\nClick this link to reset your password: ${resetUrl}\n\nThis link expires in 1 hour.\nIf you didn't request this, ignore this email.`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Reset Your Password</h2>
              <p>Click the button below to reset your password:</p>
              <div style="margin: 20px 0;">
                <a href="${resetUrl}" style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Reset Password</a>
              </div>
              <p>Or copy this link: <a href="${resetUrl}">${resetUrl}</a></p>
              <p><small>This link expires in 1 hour. If you didn't request this, ignore this email.</small></p>
            </div>
          `
        });
        
        this.logger.log(`Password reset email sent to ${email}`);
        return;
      } catch (error) {
        this.logger.error(`Failed to send email: ${error.message}`);
      }
    }
    
    // Fallback to console logging
    console.log('\n=== PASSWORD RESET TOKEN ===');
    console.log(`Email: ${email}`);
    console.log(`Token: ${token}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log('============================\n');
    this.logger.warn('Make sure your Next.js client is running on the CLIENT_URL port');
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    try {
      const user = await this.usersService.findByVerificationToken(token);
      if (!user) {
        throw new BadRequestException('Invalid or expired verification token');
      }

      await this.usersService.markEmailAsVerified(user.id);
      this.logger.log(`Email verified for user: ${user.email}`);
      
      return { message: 'Email verified successfully' };
    } catch (error) {
      this.logger.error(`Email verification failed: ${error.message}`);
      throw error;
    }
  }
}