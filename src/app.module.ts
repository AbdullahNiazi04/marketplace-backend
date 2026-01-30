import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { AuthGuard } from './common/guards/auth.guard';
import { UsersModule } from './modules/users/users.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ListingsModule } from './modules/listings/listings.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ShippingModule } from './modules/shipping/shipping.module';
import { DisputesModule } from './modules/disputes/disputes.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { ChatModule } from './modules/chat/chat.module';

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
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule { }
