import { IsEmail, IsLatitude, IsLongitude, IsOptional, IsUrl, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class GeoPointDto {
  @IsLatitude()
  latitude!: number;

  @IsLongitude()
  longitude!: number;
}

export class UpdateMeDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsUrl()
  cnicFrontUrl?: string;

  @IsOptional()
  @IsUrl()
  cnicBackUrl?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => GeoPointDto)
  workshopLocation?: GeoPointDto;
}

export { GeoPointDto };
