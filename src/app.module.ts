import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './database/database.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthGuard } from './common/guards/auth.guard.js';
import { UsersModule } from './modules/users/users.module.js';
import { CompaniesModule } from './modules/companies/companies.module.js';
import { CategoriesModule } from './modules/categories/categories.module.js';
import { ListingsModule } from './modules/listings/listings.module.js';
import { OrdersModule } from './modules/orders/orders.module.js';
import { PaymentsModule } from './modules/payments/payments.module.js';
import { ShippingModule } from './modules/shipping/shipping.module.js';
import { DisputesModule } from './modules/disputes/disputes.module.js';
import { ReviewsModule } from './modules/reviews/reviews.module.js';
import { ChatModule } from './modules/chat/chat.module.js';
import { AuthModule } from './modules/auth/auth.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    UsersModule,
    CompaniesModule,
    CategoriesModule,
    ListingsModule,
    OrdersModule,
    PaymentsModule,
    ShippingModule,
    DisputesModule,
    ReviewsModule,
    ChatModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule { }
