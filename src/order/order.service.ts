import { Injectable } from '@nestjs/common';
import { MagentoService } from '../magento/magento.service';
import { OrderDto } from './dto/OrderDto';

@Injectable()
export class OrderService {
  constructor(private magentoService: MagentoService) {}

  async createOrder(orderDto: OrderDto, token: string): Promise<any> {
    const cartId = await this.magentoService.createCart(token);
    const itemResponse = await this.magentoService.addItemToCart(
      token,
      cartId,
      orderDto.sku,
      orderDto.quantity,
    );
    return itemResponse.data;
  }

  async getOrder(id: string, token: string): Promise<any> {
    return await this.magentoService.getOrderById(id, token);
  }
}
