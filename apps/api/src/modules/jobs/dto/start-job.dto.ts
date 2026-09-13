import { IsString, Matches } from 'class-validator';

export class StartJobDto {
  @IsString()
  @Matches(/^\d{4}$/, { message: 'Expected a 4-digit entry PIN' })
  pin!: string;
}
