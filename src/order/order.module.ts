import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { MagentoService } from '../magento/magento.service';
import { AuthValidationInterceptor } from './interceptors/auth-validation.interceptor';
import { TransformResponseInterceptor } from './interceptors/transform-response.interceptor';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

@Module({
  imports: [HttpModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    MagentoService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuthValidationInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
  exports: [OrderService, MagentoService],
})
export class OrderModule {}
