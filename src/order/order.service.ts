import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { MagentoService } from '../magento/magento.service';
import { CreateOrderDTO } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(private magentoService: MagentoService) {}

  async createOrder(
    createOrderDTO: CreateOrderDTO,
    token: string,
  ): Promise<any> {
    // Validação da flag de endereço
    if (!createOrderDTO.useDefaultAddress) {
      if (!createOrderDTO.billing_address) {
        throw new BadRequestException(
          'Billing address is required when useDefaultAddress is false or not provided',
        );
      }
      if (!createOrderDTO.shipping_address) {
        throw new BadRequestException(
          'Shipping address is required when useDefaultAddress is false or not provided',
        );
      }
    }

    const cartId = await this.magentoService.createCart(token);
    if (!cartId) {
      throw new BadRequestException('Failed to create cart');
    }

    for (const item of createOrderDTO.items) {
      const addItemResponse = await this.magentoService.addItemToCart(
        token,
        cartId,
        item.sku,
        item.qty,
      );
      if (!addItemResponse) {
        throw new BadRequestException('Failed to add item to cart');
      }
    }

    let billingAddress = createOrderDTO.billing_address;
    let shippingAddress = createOrderDTO.shipping_address;

    if (createOrderDTO.useDefaultAddress) {
      const userDetails = await this.magentoService.getUserDetails(token);
      if (!userDetails.addresses || userDetails.addresses.length === 0) {
        throw new BadRequestException('No default addresses found for user.');
      }

      if (!billingAddress) {
        billingAddress = userDetails.addresses.find(
          (address: any) => address.default_billing,
        );
      }

      if (!shippingAddress) {
        shippingAddress = userDetails.addresses.find(
          (address: any) => address.default_shipping,
        );
      }

      if (!shippingAddress) {
        throw new BadRequestException(
          'No default shipping address found for user.',
        );
      }
    }

    if (!billingAddress || !shippingAddress) {
      throw new BadRequestException('Billing or shipping address is missing.');
    }

    const setShippingMethodResponse =
      await this.magentoService.setShippingMethod(
        token,
        cartId,
        billingAddress,
        shippingAddress,
        createOrderDTO.shipping_method.method_code,
        createOrderDTO.shipping_method.carrier_code,
      );
    if (!setShippingMethodResponse) {
      throw new BadRequestException('Failed to set shipping method');
    }

    const setPaymentMethodResponse = await this.magentoService.setPaymentMethod(
      token,
      { method: createOrderDTO.payment_method.method },
    );
    if (!setPaymentMethodResponse) {
      throw new BadRequestException('Failed to set payment method');
    }

    const order = await this.magentoService.placeOrder(token);
    if (!order) {
      throw new BadRequestException('Failed to place order');
    }

    return order;
  }

  async getOrder(id: string, token: string): Promise<any> {
    const order = await this.magentoService.getOrderById(id, token);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }
}
