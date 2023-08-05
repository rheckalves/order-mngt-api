import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { CartService } from './cart.service';
import { GetUserToken } from '../auth/get-user-token.decorator';
import { AddItemDto } from './add-item.dto';

@ApiBearerAuth()
@ApiTags('Cart')
@UseGuards(AuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}
  @Post()
  create(@GetUser() user: any, @GetUserToken() token: string) {
    return this.cartService.create(token);
  }
  @Get()
  getCart(@GetUserToken() token: string) {
    return this.cartService.getCart(token);
  }
  @ApiParam({ name: 'id', required: true })
  @Put(':id/items')
  addItem(
    @GetUserToken() token: string,
    @Param('id') cartId: number,
    @Body() addItemDto: AddItemDto,
  ) {
    return this.cartService.addItem(token, cartId, addItemDto);
  }
  // @Put(':id/shipmment')
  // configureShippment() {}
}
