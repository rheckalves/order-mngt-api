import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { MagentoService } from '../magento/magento.service';

@Module({
  imports: [HttpModule],
  controllers: [OrderController],
  providers: [OrderService, MagentoService],
  exports: [OrderService, MagentoService],
})
export class OrderModule {}
