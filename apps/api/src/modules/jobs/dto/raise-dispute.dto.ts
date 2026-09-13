import { IsIn, IsOptional, IsString } from 'class-validator';
import { DISPUTE_CATEGORIES, type DisputeCategory } from '@ustavia/shared';

export class RaiseDisputeDto {
  @IsIn(DISPUTE_CATEGORIES)
  category!: DisputeCategory;

  @IsOptional()
  @IsString()
  details?: string;
}
