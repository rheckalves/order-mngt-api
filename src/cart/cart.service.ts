import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { AddItemDto } from './add-item.dto';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);
  private axiosClient: AxiosInstance;
  constructor(private readonly configService: ConfigService) {
    this.axiosClient = axios.create({
      baseURL: configService.get('MAGENTO_URL'),
    });
  }
  async create(token: string) {
    const payload: AxiosRequestConfig = {
      url: '/rest/V1/carts/mine',
      method: 'POST',
      headers: { Authorization: token },
    };
    try {
      const { data } = await this.axiosClient.request<string>(payload);
      return { id: data };
    } catch (error) {
      this.logger.error(error?.response?.data?.message);
      throw new InternalServerErrorException('Error on create cart');
    }
  }
  async getCart(token: string) {
    const payload: AxiosRequestConfig = {
      url: '/rest/V1/carts/mine',
      method: 'GET',
      headers: { Authorization: token },
    };
    try {
      const { data } = await this.axiosClient.request<string>(payload);
      return data;
    } catch (error) {
      this.logger.error(error?.response?.data?.message);
      throw new InternalServerErrorException('Error on get cart');
    }
  }
  async addItem(token: string, cartId: number, addItemDto: AddItemDto) {
    const payload: AxiosRequestConfig = {
      url: '/rest/V1/carts/mine/items',
      method: 'POST',
      headers: { Authorization: token },
      data: { cartItem: { ...addItemDto, quote_id: cartId } },
    };
    try {
      const { data } = await this.axiosClient.request<string>(payload);
      return data;
    } catch (error) {
      this.logger.error(error?.response?.data?.message);
      throw new InternalServerErrorException('Error on add item to cart');
    }
  }
}
