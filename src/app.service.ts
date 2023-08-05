import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import Order from './order/Product';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  getHello(): string {
    return 'Hello World!';
  }

  findAll(): Promise<AxiosResponse<Order[]>> {
    return this.httpService.axiosRef.get('http://localhost:3000/cats');
  }
}
