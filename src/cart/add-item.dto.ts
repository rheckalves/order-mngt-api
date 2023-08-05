import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AddItemDto {
  @ApiProperty()
  @IsNotEmpty()
  sku: string;
  @ApiProperty()
  @IsNotEmpty()
  qty: number;
}
