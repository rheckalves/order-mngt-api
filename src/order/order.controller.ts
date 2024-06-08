import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Headers,
  Logger,
  UseInterceptors,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiHeader,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthValidationInterceptor } from './interceptors/auth-validation.interceptor';
import { CreateOrderValidationInterceptor } from './interceptors/create-order-validation.interceptor';
import { TransformResponseInterceptor } from './interceptors/transform-response.interceptor';

@ApiTags('Orders')
@ApiBearerAuth('access-token')
@UseInterceptors(AuthValidationInterceptor, TransformResponseInterceptor)
@Controller('orders')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({ type: CreateOrderDto, description: 'Order data' })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid order data provided.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseInterceptors(CreateOrderValidationInterceptor)
  async createOrder(
    @Body() orderDto: CreateOrderDto,
    @Headers('Authorization') authorizationHeader: string,
  ) {
    this.logger.log(`Authorization header received: ${authorizationHeader}`);
    const token = authorizationHeader.split(' ')[1];

    try {
      const order = await this.orderService.createOrder(orderDto, token);
      return order;
    } catch (error) {
      this.logger.error(`Error creating order: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of the order to retrieve',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Access token',
  })
  @ApiResponse({
    status: 200,
    description: 'Order retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getOrder(
    @Param('id') id: string,
    @Headers('Authorization') authorizationHeader: string,
  ) {
    this.logger.log(`Authorization header received: ${authorizationHeader}`);
    const token = authorizationHeader.split(' ')[1];

    try {
      const order = await this.orderService.getOrder(id, token);
      if (!order) {
        throw new NotFoundException('Order not found');
      }
      return order;
    } catch (error) {
      this.logger.error(`Error retrieving order: ${error.message}`);
      throw new NotFoundException(error.message);
    }
  }
}
