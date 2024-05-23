import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrderModule } from './order/order.module';
import { AppController } from './app.controller';
import { HttpModule } from '@nestjs/axios';
import { ApmModule } from 'elastic-apm-nest';

@Module({
  imports: [
    ApmModule.forRootAsync(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    OrderModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],

  controllers: [AppController],
})
export class AppModule {}
