import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { BookingsModule } from './bookings/bookings.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FeedbackModule } from './feedback/feedback.module';
import { PricingModule } from './pricing/pricing.module';
import { SecurityMiddleware } from './common/security.middleware';
import { BookingGateway } from './websocket/websocket.gateway';
import { PaymentsService } from './payments/payments.service';
import { PaymentsController } from './payments/payments.controller';
import { NotificationsService } from './notifications/notifications.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI ?? 'mongodb://localhost:27017/TaxiTera'),

    BookingsModule,
    UsersModule,
    AuthModule,
    FeedbackModule,
    PricingModule,
  ],
  providers: [BookingGateway, PaymentsService, NotificationsService],
  controllers: [AppController, PaymentsController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SecurityMiddleware).forRoutes('*');
  }
}