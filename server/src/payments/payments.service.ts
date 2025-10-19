import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key', {
      apiVersion: '2025-09-30.clover',
    });
  }

  async createPaymentIntent(amount: number, currency = 'usd') {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      throw new Error(`Payment processing failed: ${error.message}`);
    }
  }

  async confirmPayment(paymentIntentId: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      return {
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
      };
    } catch (error) {
      throw new Error(`Payment confirmation failed: ${error.message}`);
    }
  }
}