import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendBookingConfirmation(email: string, bookingDetails: any) {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'TaxiTera - Booking Confirmation',
      html: `
        <h2>Booking Confirmed!</h2>
        <p>Your booking for ${bookingDetails.route} has been confirmed.</p>
        <p><strong>Date:</strong> ${bookingDetails.date}</p>
        <p><strong>Time:</strong> ${bookingDetails.time}</p>
        <p><strong>Seats:</strong> ${bookingDetails.seatsBooked}</p>
        <p><strong>Total:</strong> $${bookingDetails.price}</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error };
    }
  }
}