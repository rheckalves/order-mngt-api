import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, IsNotEmpty, IsString } from '@nestjs/class-validator';

export class OrderDto {
  @ApiProperty({ example: 'ABC123' })
  @IsNotEmpty()
  @IsString()
  sku: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  quantity: number;
}
