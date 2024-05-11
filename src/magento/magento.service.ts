import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AxiosError, AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class MagentoService {
  constructor(private httpService: HttpService) {}

  async createCart(token: string): Promise<string> {
    const url = 'http://magento.local/rest/V1/carts/mine';
    const headers = { Authorization: token };
    const response: AxiosResponse = await this.httpService
      .post(url, {}, { headers })
      .toPromise();
    return response.data;
  }

  async addItemToCart(
    token: string,
    cartId: string,
    sku: string,
    quantity: number,
  ): Promise<any> {
    const url = `http://magento.local/rest/V1/carts/mine/items`;
    const headers = { Authorization: token };
    const body = {
      cartItem: {
        sku: sku,
        qty: quantity,
        quote_id: cartId,
      },
    };
    return this.httpService.post(url, body, { headers }).toPromise();
  }

  async getOrderById(id: string, token: string): Promise<any> {
    const url = `http://magento.local/rest/V1/orders/${id}`;
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const response = await lastValueFrom(
        this.httpService.get(url, { headers }),
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to retrieve order: ' + error.message);
    }
  }

  async createProduct(productData: any, accessToken: string): Promise<any> {
    const url = `http://your-magento-site.com/rest/V1/products`;

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
      const axiosError = error as AxiosError;
      throw new HttpException(
        'Failed to create product: ' + axiosError.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
