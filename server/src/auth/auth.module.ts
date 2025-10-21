import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { RateLimitMiddleware } from '../common/middleware/rate-limit.middleware';
import { EmailVerificationService } from './email-verification.service';
import { EmailService } from './email.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => {
        const secret = process.env.JWT_SECRET;
        if (!secret && process.env.NODE_ENV === 'production') {
          throw new Error('JWT_SECRET is required in production');
        }
        return {
          global: true,
          secret: secret || 'fallback-secret-for-development',
          signOptions: { 
            expiresIn: '1h',
            issuer: 'taxitera-api',
            audience: 'taxitera-client'
          },
        };
      },
    }),
  ],
  providers: [AuthService, JwtStrategy, RateLimitMiddleware, EmailVerificationService, EmailService],
  controllers: [AuthController]
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimitMiddleware)
      .forRoutes(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/register', method: RequestMethod.POST }
      );
  }
}