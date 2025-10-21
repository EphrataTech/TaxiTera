import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter;

  constructor() {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      this.logger.warn('SMTP configuration missing. Email service will use fallback logging.');
      this.transporter = null;
    } else {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      this.logger.log('Email service initialized with SMTP configuration');
    }
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    
    try {
      await this.transporter.sendMail({
        from: `${process.env.EMAIL_FROM_NAME} <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Verify Your Email - TaxiTera',
        html: `
          <h2>Welcome to TaxiTera!</h2>
          <p>Please click the link below to verify your email address:</p>
          <a href="${verificationUrl}" style="background: #f59e0b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
          <p>Or copy this link: ${verificationUrl}</p>
        `,
      });
      this.logger.log(`Verification email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send verification email: ${error.message}`);
      // Fallback to console logging
      this.logger.log(`Verification link: ${verificationUrl}`);
    }
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
    if (!this.transporter) {
      this.logger.log(`[FALLBACK] Password reset link for ${email}: ${resetUrl}`);
      return;
    }
    
    try {
      await this.transporter.sendMail({
        from: `${process.env.EMAIL_FROM_NAME || 'TaxiTera'} <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Reset Your Password - TaxiTera',
        html: `
          <h2>Password Reset Request</h2>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}" style="background: #f59e0b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p>Or copy this link: ${resetUrl}</p>
          <p>This link expires in 1 hour.</p>
        `,
      });
      this.logger.log(`Password reset email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send reset email to ${email}: ${error.message}`);
      this.logger.log(`[FALLBACK] Reset link: ${resetUrl}`);
      throw error;
    }
  }

  generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}