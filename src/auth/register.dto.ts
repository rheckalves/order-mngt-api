import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

class AddressRegionDto {
  regionCode: string;
  region: string;
  regionId: number;
}
class AddressDto {
  firstname: string;
  lastname: string;
  defaultShipping: boolean;
  defaultBilling: boolean;
  region: AddressRegionDto;
  postcode: string;
  street: Array<string>;
  city: string;
  telephone: string;
  countryId: string;
}

export class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  firstname: string;
  @IsNotEmpty()
  lastname: string;
  @IsOptional()
  address: AddressDto;
}
