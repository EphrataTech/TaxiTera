import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private store: RateLimitStore = {};
  private readonly windowMs = 15 * 60 * 1000; // 15 minutes
  private readonly maxAttempts = 5; // Max 5 attempts per window

  use(req: Request, res: Response, next: NextFunction) {
    const key = this.getKey(req);
    const now = Date.now();
    
    // Clean expired entries
    this.cleanExpiredEntries(now);
    
    if (!this.store[key]) {
      this.store[key] = {
        count: 1,
        resetTime: now + this.windowMs
      };
      return next();
    }
    
    const record = this.store[key];
    
    if (now > record.resetTime) {
      // Reset the window
      record.count = 1;
      record.resetTime = now + this.windowMs;
      return next();
    }
    
    if (record.count >= this.maxAttempts) {
      const remainingTime = Math.ceil((record.resetTime - now) / 1000);
      throw new HttpException(
        {
          message: 'Too many attempts. Please try again later.',
          retryAfter: remainingTime
        },
        HttpStatus.TOO_MANY_REQUESTS
      );
    }
    
    record.count++;
    next();
  }
  
  private getKey(req: Request): string {
    // Use IP address and endpoint as key
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    return `${ip}:${req.path}`;
  }
  
  private cleanExpiredEntries(now: number) {
    Object.keys(this.store).forEach(key => {
      if (now > this.store[key].resetTime) {
        delete this.store[key];
      }
    });
  }
}