import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrderModule } from './order/order.module';
import { AppController } from './app.controller';
import { ApmModule } from 'elastic-apm-nest';

@Module({
  imports: [
    ApmModule.forRootAsync(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    OrderModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
