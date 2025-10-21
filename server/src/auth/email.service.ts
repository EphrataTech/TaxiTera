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

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    if (!this.transporter) {
      this.logger.log(`[FALLBACK] Welcome email for ${email}`);
      return;
    }
    
    try {
      await this.transporter.sendMail({
        from: `${process.env.EMAIL_FROM_NAME || 'TaxiTera'} <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Welcome to TaxiTera! 🚌',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #f59e0b;">Welcome to TaxiTera, ${name}! 🎉</h2>
            <p>Thank you for joining TaxiTera - your trusted transportation partner in Addis Ababa.</p>
            <p>You can now:</p>
            <ul>
              <li>✅ Book rides instantly</li>
              <li>✅ Track your bookings</li>
              <li>✅ Get digital e-tickets</li>
              <li>✅ Enjoy secure payments</li>
            </ul>
            <p>Start your journey today!</p>
            <a href="${process.env.FRONTEND_URL}/book" style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0;">Book Your First Ride</a>
            <p>Best regards,<br>The TaxiTera Team</p>
          </div>
        `,
      });
      this.logger.log(`Welcome email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${email}: ${error.message}`);
    }
  }

  async sendPaymentConfirmationEmail(email: string, bookingDetails: any): Promise<void> {
    if (!this.transporter) {
      this.logger.log(`[FALLBACK] Payment confirmation email for ${email}`);
      return;
    }
    
    try {
      await this.transporter.sendMail({
        from: `${process.env.EMAIL_FROM_NAME || 'TaxiTera'} <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Payment Confirmed - Your TaxiTera Booking ✅',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #10b981;">Payment Successful! 🎉</h2>
            <p>Thank you for choosing TaxiTera! Your booking has been confirmed.</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">Booking Details:</h3>
              <p><strong>Route:</strong> ${bookingDetails.route}</p>
              <p><strong>Date:</strong> ${bookingDetails.date}</p>
              <p><strong>Time:</strong> ${bookingDetails.time}</p>
              <p><strong>Vehicle:</strong> ${bookingDetails.vehicleType}</p>
              <p><strong>Seats:</strong> ${bookingDetails.seats}</p>
              <p><strong>Passengers:</strong> ${bookingDetails.passengerNames?.join(', ')}</p>
              <p><strong>Total Paid:</strong> $${bookingDetails.totalPrice}</p>
              <p><strong>Booking ID:</strong> ${bookingDetails.bookingId}</p>
            </div>
            
            <p>📱 Your e-ticket QR code is available in your dashboard.</p>
            <p>🚌 Show your QR code to the driver when boarding.</p>
            
            <a href="${process.env.FRONTEND_URL}/dashboard" style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0;">View Dashboard</a>
            
            <p>Have a safe journey!</p>
            <p>Best regards,<br>The TaxiTera Team</p>
          </div>
        `,
      });
      this.logger.log(`Payment confirmation email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send payment confirmation email to ${email}: ${error.message}`);
    }
  }

  generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}