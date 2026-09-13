import { IsDateString, IsPositive, IsNumber } from 'class-validator';

export class ProposeConfirmationDto {
  @IsNumber()
  @IsPositive()
  price!: number;

  @IsDateString()
  time!: string;
}
