import { ApiProperty } from '@nestjs/swagger';

class OrderDto {
  @ApiProperty()
  sku: string;
  @ApiProperty()
  token: string;
}

export default OrderDto;
