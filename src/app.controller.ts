import { Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('order')
  async createOrder() {
    return await this.appService.createOrder();
  }

  @Get('order/:id')
  async getOrder(@Param('id') id: string) {
    return await this.appService.getOrder(id);
  }
}
