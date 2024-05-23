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

export class AddressDto {
  @ApiProperty({ example: 'John', description: 'First name of the customer' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the customer' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

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
  regionId: number;

  @ApiProperty({ example: '12345', description: 'Postal code' })
  @IsString()
  @IsNotEmpty()
  postCode: string;

  @ApiProperty({ example: 'US', description: 'Country code' })
  @IsString()
  @IsNotEmpty()
  countryId: string;

  @ApiProperty({ example: '555-555-5555', description: 'Telephone number' })
  @IsString()
  @IsNotEmpty()
  telephone: string;
}

class ItemDto {
  @ApiProperty({ example: 1, description: 'Product ID' })
  @IsNumber()
  @IsPositive()
  productId: number;

  @ApiProperty({ example: 'product-sku', description: 'Product SKU' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ example: 1, description: 'Quantity of the product' })
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiProperty({ example: 100, description: 'Price of the product' })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ example: 'Product Name', description: 'Name of the product' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

class PaymentMethodDto {
  @ApiProperty({ example: 'checkmo', description: 'Payment method' })
  @IsString()
  @IsNotEmpty()
  method: string;
}

class ShippingMethodDto {
  @ApiProperty({ example: 'flatrate', description: 'Shipping method code' })
  @IsString()
  @IsNotEmpty()
  methodCode: string;

  @ApiProperty({ example: 'flatrate', description: 'Shipping carrier code' })
  @IsString()
  @IsNotEmpty()
  carrierCode: string;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'USD', description: 'Currency ID' })
  @IsString()
  @IsNotEmpty()
  currencyId: string;

  @ApiProperty({
    example: 'customer@example.com',
    description: 'Customer email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: AddressDto,
    description: 'Billing address',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  billingAddress?: AddressDto;

  @ApiProperty({
    type: AddressDto,
    description: 'Shipping address',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  shippingAddress?: AddressDto;

  @ApiProperty({ type: [ItemDto], description: 'List of items' })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  items: ItemDto[];

  @ApiProperty({ type: PaymentMethodDto, description: 'Payment method' })
  @ValidateNested()
  @Type(() => PaymentMethodDto)
  paymentMethod: PaymentMethodDto;

  @ApiProperty({ type: ShippingMethodDto, description: 'Shipping method' })
  @ValidateNested()
  @Type(() => ShippingMethodDto)
  shippingMethod: ShippingMethodDto;

  @ApiProperty({
    example: true,
    description: 'Flag to use default address',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  useDefaultAddress?: boolean;
}
