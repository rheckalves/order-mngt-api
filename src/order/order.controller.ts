import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Headers,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDTO } from './dto/create-order.dto';
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
  @ApiBody({ type: CreateOrderDTO, description: 'Order data' })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid order data provided.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createOrder(
    @Body() orderDto: CreateOrderDTO,
    @Headers('authorization') authorizationHeader: string,
  ) {
    // Pré-condição: Validação do cabeçalho de autorização
    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    const [bearer, token] = authorizationHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization header');
    }

    // Pós-condição: Verificação do resultado da criação do pedido
    try {
      const order = await this.orderService.createOrder(orderDto, token);
      if (!order) {
        throw new BadRequestException('Failed to create order');
      }
      return order;
    } catch (error) {
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
    type: CreateOrderDTO,
  })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getOrder(
    @Param('id') id: string,
    @Headers('Authorization') authorizationHeader: string,
  ) {
    // Pré-condição: Validação do cabeçalho de autorização
    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    const [bearer, token] = authorizationHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization header');
    }

    // Pós-condição: Verificação do resultado da recuperação do pedido
    const order = await this.orderService.getOrder(id, token);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }
}
