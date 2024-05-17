import { Injectable } from '@nestjs/common';
import { MagentoService } from '../magento/magento.service';
import { OrderDto } from './dto/OrderDto';

@Injectable()
export class OrderService {
  constructor(private magentoService: MagentoService) {}

  async createOrder(orderDto: OrderDto, token: string): Promise<any> {
    const cartId = await this.magentoService.createCart(token);
    await this.magentoService.addItemToCart(
      token,
      cartId,
      orderDto.sku,
      orderDto.quantity,
    );

    const userDetails = await this.magentoService.getUserDetails(token);
    if (!userDetails.addresses || userDetails.addresses.length === 0) {
      throw new Error('No default shipping address found for user.');
    }

    const shippingAddress = userDetails.addresses.find(
      (address: any) => address.default_shipping,
    );

    if (!shippingAddress) {
      throw new Error('No default shipping address found for user.');
    }

    await this.magentoService.setShippingMethod(token, cartId, shippingAddress);

    const paymentMethod = {
      method: 'checkmo',
    };
    await this.magentoService.setPaymentMethod(token, paymentMethod);

    const order = await this.magentoService.placeOrder(token);
    return order;
  }

  async getOrder(id: string, token: string): Promise<any> {
    return await this.magentoService.getOrderById(id, token);
  }
}
