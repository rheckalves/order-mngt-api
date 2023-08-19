import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import Order from './order/Product';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  getOrder(id: string) {
    throw new Error('Method not implemented.');
  }

  createOrder() {
    return {
      id: '1234567890',
      status: 'pending',
    };
  }

  findAll(): Promise<AxiosResponse<Order[]>> {
    return this.httpService.axiosRef.get('http://localhost:3000/cats');
  }
}
