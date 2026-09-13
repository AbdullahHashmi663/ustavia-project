import { IsIn, IsString, Matches } from 'class-validator';
import { USER_ROLES, type UserRole } from '@ustavia/shared';

export class VerifyOtpDto {
  @IsString()
  @Matches(/^\+92\d{10}$/, { message: 'Expected a Pakistan phone number in +92XXXXXXXXXX form' })
  phone!: string;

  @IsString()
  @Matches(/^\d{6}$/, { message: 'Expected a 6-digit code' })
  code!: string;

  /** Only used the first time this phone is seen — role is immutable after signup, ARCHITECTURE.md §2.1. */
  @IsIn(USER_ROLES)
  role!: UserRole;
}
