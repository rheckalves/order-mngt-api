import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import Order from './order/Product';
import OrderDto from './OrderDto';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  getOrder(id: string) {
    throw new Error('Method not implemented.');
  }

  async createOrder(orderDto: OrderDto) {
    try {
      const pathUrl = 'http://localhost:8080/rest/default/V1/carts/mine';
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${orderDto.token}`,
      };

      console.log('Headers', headers);

      console.log('#1: CRIA O CARRINHO OU QUOTE');
      const responde_quote_id = await this.httpService.axiosRef.post(pathUrl, {}, { headers });
      const quote_id = responde_quote_id.data;
      console.log('#1.1: CRIOU O CARRINHO OU QUOTE', quote_id);

      console.log('#2: ADICIONA O ITEM AO CARRINHO');
      const data = {
        cartItem: {
          sku: orderDto.sku,
          qty: 1,
          quote_id,
        },
      };
      console.log('#2.1: preparou os dados', data);
      const cart = await this.httpService.axiosRef.post(
        `${pathUrl}/items`,
        data,
        { headers },
      );
      console.log('#2.2: Adicionou o Item ao carrinho', cart.data);

      console.log('#3: Adiciona o endereço');
      const address = {
        addressInformation: {
          shipping_address: {
            region: 'São Paulo',
            region_id: 43,
            region_code: 'NY',
            country_id: 'US',
            street: ['123 Oak Ave'],
            postcode: '10577',
            city: 'Purchase',
            firstname: 'Christiano',
            lastname: 'Almeida',
            email: 'c@milfont.org',
            telephone: '512-555-1111',
          },
          billing_address: {
            region: 'São Paulo',
            region_id: 43,
            region_code: 'NY',
            country_id: 'US',
            street: ['123 Oak Ave'],
            postcode: '10577',
            city: 'Purchase',
            firstname: 'Chrstiano',
            lastname: 'Almeida',
            email: 'c@milfont.org',
            telephone: '512-555-1111',
          },
          shipping_carrier_code: 'freeshipping',
          shipping_method_code: 'freeshipping',
        },
      };
      const cart2 = await this.httpService.axiosRef.post(
        `${pathUrl}/shipping-information`,
        address,
        { headers },
      );
      console.log('#3.1: Adicionou o endereço ', cart2.data);

      console.log('#4: INFORMA MEIO DE PAGAMENTO');
      const payment = {
        paymentMethod: { method: 'checkmo' },
      };
      const cart3 = await this.httpService.axiosRef.post(
        `${pathUrl}/payment-information`,
        payment,
        { headers },
      );
      console.log('#4.1: Fechou o pedido ', cart3.data);

      return cart3.data;
    } catch (error) {
      console.log(error);
    }

    return null;
  }

  findAll(): Promise<AxiosResponse<Order[]>> {
    return this.httpService.axiosRef.get('http://localhost:3000/cats');
  }
}
