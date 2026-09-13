import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { CurrentUser } from '../../common/auth/current-user.decorator';
import { JwtAuthGuard, type AuthenticatedRequest } from '../../common/auth/jwt-auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RequestOtpDto } from './dto/request-otp.dto';
import { SetPasswordDto } from './dto/set-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('otp/request')
  requestOtp(@Body() dto: RequestOtpDto) {
    return this.auth.requestOtp(dto.phone);
  }

  @Post('otp/verify')
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.auth.verifyOtp(dto.phone, dto.code, dto.role);
  }

  /** Returning-user fast path — phone + password, no OTP round trip. Only works once the account has set a password via POST /auth/password. */
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.loginWithPassword(dto.phone, dto.password);
  }

  /** Set/change the caller's own password — requires an existing session (from OTP or a prior password login). */
  @Post('password')
  @UseGuards(JwtAuthGuard)
  setPassword(@CurrentUser() user: AuthenticatedRequest['user'], @Body() dto: SetPasswordDto) {
    return this.auth.setPassword(user.id, dto.password);
  }
}
