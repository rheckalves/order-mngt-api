// src/app.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OrderService } from './order/order.service';
import { MagentoController } from './magento/magento.controller';

import { OrderController } from './order/order.controller';
import { MagentoService } from './magento/magento.service';

@Module({
  imports: [HttpModule],
  controllers: [OrderController, MagentoController],
  providers: [OrderService, MagentoService],
})
export class AppModule {}
