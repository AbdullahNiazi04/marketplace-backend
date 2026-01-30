import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  // Disable body parser for Better Auth to handle raw request body
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // API prefix
  app.setGlobalPrefix('api/v1');

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Nizron Marketplace API')
    .setDescription('B2B & B2C E-Commerce Marketplace API')
    .setVersion('1.0')
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Users', 'User management endpoints')
    .addTag('Companies', 'B2B company management')
    .addTag('Categories', 'Product categories')
    .addTag('Listings', 'Product listings')
    .addTag('Orders', 'Order management')
    .addTag('Payments', 'Payment processing')
    .addTag('Shipping', 'Shipping management')
    .addTag('Disputes', 'Dispute resolution')
    .addTag('Reviews', 'Reviews and ratings')
    .addTag('Chat', 'Buyer-Seller messaging')
    .addCookieAuth('better-auth.session_token')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Nizron Marketplace API running on: http://localhost:${port}`);
  console.log(`Swagger UI available at: http://localhost:${port}/api`);
  console.log('--- SERVER STARTED SUCCESSFULLY (Fresh Build) ---');
}

bootstrap();