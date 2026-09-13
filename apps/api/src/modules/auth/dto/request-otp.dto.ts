import { IsString, Matches } from 'class-validator';

export class RequestOtpDto {
  /** +92XXXXXXXXXX — same pattern packages/shared's user.schema.ts validates against. */
  @IsString()
  @Matches(/^\+92\d{10}$/, { message: 'Expected a Pakistan phone number in +92XXXXXXXXXX form' })
  phone!: string;
}
