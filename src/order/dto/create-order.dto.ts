import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AddressDTO {
  @ApiProperty({ example: 'John', description: 'First name of the customer' })
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the customer' })
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({ example: '123 Main St', description: 'Street address' })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({ example: 'Anytown', description: 'City' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'CA', description: 'Region or state' })
  @IsString()
  @IsNotEmpty()
  region: string;

  @ApiProperty({ example: '12', description: 'Region ID' })
  @IsNumber()
  @IsPositive()
  region_id: number;

  @ApiProperty({ example: '12345', description: 'Postal code' })
  @IsString()
  @IsNotEmpty()
  postcode: string;

  @ApiProperty({ example: 'US', description: 'Country code' })
  @IsString()
  @IsNotEmpty()
  country_id: string;

  @ApiProperty({ example: '555-555-5555', description: 'Telephone number' })
  @IsString()
  @IsNotEmpty()
  telephone: string;
}

class ItemDTO {
  @ApiProperty({ example: 1, description: 'Product ID' })
  @IsNumber()
  @IsPositive()
  product_id: number;

  @ApiProperty({ example: 'product-sku', description: 'Product SKU' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ example: 1, description: 'Quantity of the product' })
  @IsNumber()
  @IsPositive()
  qty: number;

  @ApiProperty({ example: 100, description: 'Price of the product' })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ example: 'Product Name', description: 'Name of the product' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

class PaymentMethodDTO {
  @ApiProperty({ example: 'checkmo', description: 'Payment method' })
  @IsString()
  @IsNotEmpty()
  method: string;
}

class ShippingMethodDTO {
  @ApiProperty({ example: 'flatrate', description: 'Shipping method code' })
  @IsString()
  @IsNotEmpty()
  method_code: string;

  @ApiProperty({ example: 'flatrate', description: 'Shipping carrier code' })
  @IsString()
  @IsNotEmpty()
  carrier_code: string;
}

export class CreateOrderDTO {
  @ApiProperty({ example: 'USD', description: 'Currency ID' })
  @IsString()
  @IsNotEmpty()
  currency_id: string;

  @ApiProperty({
    example: 'customer@example.com',
    description: 'Customer email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: AddressDTO,
    description: 'Billing address',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDTO)
  billing_address?: AddressDTO;

  @ApiProperty({
    type: AddressDTO,
    description: 'Shipping address',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDTO)
  shipping_address?: AddressDTO;

  @ApiProperty({ type: [ItemDTO], description: 'List of items' })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ItemDTO)
  items: ItemDTO[];

  @ApiProperty({ type: PaymentMethodDTO, description: 'Payment method' })
  @ValidateNested()
  @Type(() => PaymentMethodDTO)
  payment_method: PaymentMethodDTO;

  @ApiProperty({ type: ShippingMethodDTO, description: 'Shipping method' })
  @ValidateNested()
  @Type(() => ShippingMethodDTO)
  shipping_method: ShippingMethodDTO;

  @ApiProperty({
    example: true,
    description: 'Flag to use default address',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  useDefaultAddress?: boolean;
}
