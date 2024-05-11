import {
  Controller,
  Post,
  Body,
  Req,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { MagentoService } from './magento.service';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('Magento')
@Controller('magento')
export class MagentoController {
  constructor(private readonly magentoService: MagentoService) {}

  @Post('create-product')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Product created successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to create product.',
  })
  async createProduct(@Body() productData: any, @Req() req: any): Promise<any> {
    const accessToken = req.headers.authorization.split(' ')[1];
    return await this.magentoService.createProduct(productData, accessToken);
  }
}
