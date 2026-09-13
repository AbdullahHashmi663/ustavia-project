import { IsString, Matches, MinLength } from 'class-validator';

export class LoginDto {
  /** +92XXXXXXXXXX — same pattern as RequestOtpDto. */
  @IsString()
  @Matches(/^\+92\d{10}$/, { message: 'Expected a Pakistan phone number in +92XXXXXXXXXX form' })
  phone!: string;

  @IsString()
  @MinLength(1)
  password!: string;
}
