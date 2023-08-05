import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { LoginDto } from './login.dto';
import { RegisterDto } from './register.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private axiosClient: AxiosInstance;
  constructor(private readonly configService: ConfigService) {
    this.axiosClient = axios.create({
      baseURL: configService.get('MAGENTO_URL'),
    });
  }
  async login(data: LoginDto) {
    const payload: AxiosRequestConfig = {
      url: '/rest/V1/integration/customer/token',
      method: 'POST',
      data,
    };
    try {
      const { data } = await this.axiosClient.request<string>(payload);
      return {
        accessToken: data,
        createdAt: Date.now(),
        expireIn: '1h',
      };
    } catch (error) {
      this.logger.error(error?.response?.data?.message);
      throw new BadRequestException('Error on login');
    }
  }
  async register(customerData: RegisterDto) {
    const { password, ...others } = customerData;
    const payload: AxiosRequestConfig = {
      url: '/rest/V1/customers',
      method: 'POST',
      data: { customer: others, password },
    };
    try {
      const { data } = await this.axiosClient.request<{ id: number }>(payload);
      return { id: data.id };
    } catch (error) {
      this.logger.error(error?.response?.data?.message);
      throw new BadRequestException('Error on register');
    }
  }

  async getUser(token: string) {
    const payload: AxiosRequestConfig = {
      url: '/rest/V1/customers/me',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const { data } = await this.axiosClient.request<{
        id: number;
        email: string;
      }>(payload);
      return data;
    } catch (error) {
      this.logger.error(error?.response?.data?.message);
      throw new BadRequestException('Error on get user info');
    }
  }
}
