import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class MagentoService {
  private readonly logger = new Logger(MagentoService.name);

  constructor(private httpService: HttpService) {}

  async createCart(token: string): Promise<string> {
    const url = 'http://localhost:8080/rest/V1/carts/mine';
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const response = await lastValueFrom(
        this.httpService.post(url, {}, { headers }),
      );
      this.logger.log('Carrinho criado:', response.data);
      return response.data;
    } catch (error) {
      this.handleError(error, 'createCart');
    }
  }

  async addItemToCart(
    token: string,
    cartId: string,
    sku: string,
    quantity: number,
  ): Promise<any> {
    const url = `http://localhost:8080/rest/V1/carts/mine/items`;
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
    const url = `http://localhost:8080/rest/V1/customers/me`;
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
    address: any,
  ): Promise<any> {
    const url = `http://localhost:8080/rest/V1/carts/mine/shipping-information`;
    const headers = { Authorization: `Bearer ${token}` };
    const body = {
      addressInformation: {
        shipping_address: {
          region: address.region.region,
          region_id: address.region_id,
          country_id: address.country_id,
          street: address.street,
          telephone: address.telephone,
          postcode: address.postcode,
          city: address.city,
          firstname: address.firstname,
          lastname: address.lastname,
        },
        billing_address: {
          region: address.region.region,
          region_id: address.region_id,
          country_id: address.country_id,
          street: address.street,
          telephone: address.telephone,
          postcode: address.postcode,
          city: address.city,
          firstname: address.firstname,
          lastname: address.lastname,
        },
        shipping_method_code: 'flatrate',
        shipping_carrier_code: 'flatrate',
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
    const url = `http://localhost:8080/rest/V1/carts/mine/payment-information`;
    const headers = { Authorization: `Bearer ${token}` };
    const body = {
      paymentMethod: {
        method: paymentMethod.method,
      },
    };

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
    const url = `http://localhost:8080/rest/V1/carts/mine/order`;
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
    const url = `http://localhost:8080/rest/V1/orders/${id}`;
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

  async createProduct(productData: any, accessToken: string): Promise<any> {
    const url = `http://localhost:8080/rest/V1/products`;

    try {
      const response = await lastValueFrom(
        this.httpService.post(url, productData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }),
      );
      return response.data;
    } catch (error) {
      this.handleError(error, 'createProduct');
    }
  }

  private handleError(error: any, methodName: string): void {
    let errorMessage = `Erro desconhecido`;
    let errorDetails = {};

    if (error.response) {
        errorMessage = `${methodName} - Erro na resposta da API: ${error.response.statusText}`;
        errorDetails = {
            status: error.response.status,
            data: error.response.data,
            headers: error.response.headers
        };
        this.logger.error(errorMessage, errorDetails);
        throw new HttpException(error.response.data, error.response.status);
    } else if (error.request) {
        errorMessage = `${methodName} - Erro ao enviar a requisição para a API Magento`;
        errorDetails = {
            method: error.request.method,
            url: error.request.path,
            headers: error.request._header
        };
        this.logger.error(errorMessage, errorDetails);
        throw new HttpException(
            'Falha ao comunicar com a API Magento, sem resposta do servidor.',
            HttpStatus.GATEWAY_TIMEOUT
        );
    } else {
        this.logger.error(`${methodName} - Erro na requisição: ${error.message}`);
        throw new HttpException(
            'Erro na comunicação com a API Magento',
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
  }
}
