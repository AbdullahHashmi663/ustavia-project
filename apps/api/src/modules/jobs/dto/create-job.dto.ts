import { ArrayMaxSize, IsArray, IsOptional, IsString, IsUrl, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { GeoPointDto } from '../../users/dto/update-me.dto';

export class CreateJobDto {
  @IsString()
  @MinLength(1)
  description!: string;

  @ValidateNested()
  @Type(() => GeoPointDto)
  location!: GeoPointDto;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(6)
  @IsUrl({}, { each: true })
  photoUrls?: string[];

  @IsOptional()
  @IsUrl()
  videoUrl?: string;
}
