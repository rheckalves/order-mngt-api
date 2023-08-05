import { Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  // @Post()
  // async create() {}
}
