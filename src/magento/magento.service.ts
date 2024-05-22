import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { AddressDTO } from '../order/dto/create-order.dto';

@Injectable()
export class MagentoService {
  private readonly logger = new Logger(MagentoService.name);
  private readonly magentoUrl: string;

  constructor(private httpService: HttpService) {
    this.magentoUrl = process.env.MAGENTO_URL;
  }

  async createCart(token: string): Promise<string> {
    const url = `${this.magentoUrl}/rest/V1/carts/mine`;
    const headers = { Authorization: `Bearer ${token}` };

    this.logger.log(`Iniciando a criação do carrinho com token: ${token}`);
    this.logger.log(`URL: ${url}, Headers: ${JSON.stringify(headers)}`);

    try {
      const response = await lastValueFrom(
        this.httpService.post(url, {}, { headers }),
      );

      this.logger.log(
        `Carrinho criado com sucesso: ${JSON.stringify(response.data)}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Erro ao criar o carrinho, URL: ${url}`);
      this.handleError(error, 'createCart');
    }
  }

  async addItemToCart(
    token: string,
    cartId: string,
    sku: string,
    quantity: number,
  ): Promise<any> {
    // Pré-condição: Verificar se os parâmetros são válidos
    if (!token || !cartId || !sku || !quantity) {
      throw new HttpException('Invalid parameters', HttpStatus.BAD_REQUEST);
    }

    const url = `${this.magentoUrl}/rest/V1/carts/mine/items`;
    const headers = { Authorization: `Bearer ${token}` };
    const body = {
      cartItem: {
        sku: sku,
        qty: quantity,
        quote_id: cartId,
      },
    };

    try {
      const response = await lastValueFrom(
        this.httpService.post(url, body, { headers }),
      );

      this.logger.log('Item adicionado ao carrinho:', response.data);
      return response.data;
    } catch (error) {
      this.handleError(error, 'addItemToCart');
    }
  }

  async getUserDetails(token: string): Promise<any> {
    // Pré-condição: Verificar se o token é válido
    if (!token) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }

    const url = `${this.magentoUrl}/rest/V1/customers/me`;
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const response = await lastValueFrom(
        this.httpService.get(url, { headers }),
      );

      this.logger.log('Detalhes do usuário:', response.data);
      return response.data;
    } catch (error) {
      this.handleError(error, 'getUserDetails');
    }
  }

  async setShippingMethod(
    token: string,
    cartId: string,
    billingAddress: AddressDTO,
    shippingAddress: AddressDTO,
    shippingMethodCode: string,
    shippingCarrierCode: string,
  ): Promise<any> {
    // Pré-condição: Verificar se os parâmetros são válidos
    if (
      !token ||
      !cartId ||
      !billingAddress ||
      !shippingAddress ||
      !shippingMethodCode ||
      !shippingCarrierCode
    ) {
      throw new HttpException('Invalid parameters', HttpStatus.BAD_REQUEST);
    }

    const url = `${this.magentoUrl}/rest/V1/carts/mine/shipping-information`;
    const headers = { Authorization: `Bearer ${token}` };
    const body = {
      addressInformation: {
        shipping_address: {
          region: shippingAddress.region,
          region_id: shippingAddress.region_id,
          country_id: shippingAddress.country_id,
          street: shippingAddress.street,
          telephone: shippingAddress.telephone,
          postcode: shippingAddress.postcode,
          city: shippingAddress.city,
          firstname: shippingAddress.firstname,
          lastname: shippingAddress.lastname,
        },
        billing_address: {
          region: billingAddress.region,
          region_id: billingAddress.region_id,
          country_id: billingAddress.country_id,
          street: billingAddress.street,
          telephone: billingAddress.telephone,
          postcode: billingAddress.postcode,
          city: billingAddress.city,
          firstname: billingAddress.firstname,
          lastname: billingAddress.lastname,
        },
        shipping_method_code: shippingMethodCode,
        shipping_carrier_code: shippingCarrierCode,
      },
    };

    try {
      const response = await lastValueFrom(
        this.httpService.post(url, body, { headers }),
      );

      this.logger.log('Método de envio definido:', response.data);
      return response.data;
    } catch (error) {
      this.handleError(error, 'setShippingMethod');
    }
  }

  async setPaymentMethod(token: string, paymentMethod: any): Promise<any> {
    // Pré-condição: Verificar se os parâmetros são válidos
    if (!token || !paymentMethod) {
      throw new HttpException('Invalid parameters', HttpStatus.BAD_REQUEST);
    }

    const url = `${this.magentoUrl}/rest/V1/carts/mine/payment-information`;
    const headers = { Authorization: `Bearer ${token}` };
    const body = { paymentMethod };

    try {
      const response = await lastValueFrom(
        this.httpService.post(url, body, { headers }),
      );

      this.logger.log('Método de pagamento definido:', response.data);
      return response.data;
    } catch (error) {
      this.handleError(error, 'setPaymentMethod');
    }
  }

  async placeOrder(token: string): Promise<any> {
    // Pré-condição: Verificar se o token é válido
    if (!token) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }

    const url = `${this.magentoUrl}/rest/V1/carts/mine/order`;
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const response = await lastValueFrom(
        this.httpService.put(url, {}, { headers }),
      );

      this.logger.log('Pedido realizado:', response.data);
      return response.data;
    } catch (error) {
      this.handleError(error, 'placeOrder');
    }
  }

  async getOrderById(id: string, token: string): Promise<any> {
    // Pré-condição: Verificar se os parâmetros são válidos
    if (!id || !token) {
      throw new HttpException('Invalid parameters', HttpStatus.BAD_REQUEST);
    }

    const url = `${this.magentoUrl}/rest/V1/orders/${id}`;
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const response = await lastValueFrom(
        this.httpService.get(url, { headers }),
      );

      this.logger.log('Detalhes do pedido:', response.data);
      return response.data;
    } catch (error) {
      this.handleError(error, 'getOrderById');
    }
  }

  private handleError(error: any, methodName: string): void {
    this.logger.error(`${methodName} - Detalhes do erro:`, error);
    if (error.response) {
      this.logger.error(
        `${methodName} - Erro na resposta da API: Status ${error.response.status}`,
        error.response.data,
      );
      throw new HttpException(error.response.data, error.response.status);
    } else if (error.request) {
      this.logger.error(
        `${methodName} - Nenhuma resposta recebida, verifique a conectividade ou a configuração do servidor.`,
      );
      throw new HttpException(
        'Falha ao comunicar com a API Magento, sem resposta do servidor.',
        HttpStatus.GATEWAY_TIMEOUT,
      );
    } else {
      this.logger.error(`${methodName} - Erro na requisição: ${error.message}`);
      throw new HttpException(
        'Erro na comunicação com a API Magento',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
