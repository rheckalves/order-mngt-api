import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDto } from './dto/OrderDto';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiHeader,
} from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({ type: OrderDto, description: 'Order data' })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully.',
    type: OrderDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid order data provided.' })
  async createOrder(
    @Body() orderDto: OrderDto,
    @Headers('authorization') authorizationHeader: string,
  ) {
    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    const [bearer, token] = authorizationHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization header');
    }
    return this.orderService.createOrder(orderDto, token);
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
    type: OrderDto,
  })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  async getOrder(
    @Param('id') id: string,
    @Headers('Authorization') token: string,
  ) {
    return this.orderService.getOrder(id, token);
  }
}
