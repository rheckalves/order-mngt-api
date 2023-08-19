import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import OrderDto from './OrderDto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('order')
  async createOrder(@Body() orderDto: OrderDto) {
    return await this.appService.createOrder(orderDto);
  }

  @Get('order/:id')
  async getOrder(@Param('id') id: string) {
    return await this.appService.getOrder(id);
  }
}
