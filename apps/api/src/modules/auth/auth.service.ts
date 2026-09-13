import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { UserRole } from '@ustavia/shared';

import { UserEntity } from '../users/entities/user.entity';
import { OtpService } from './otp.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private readonly users: Repository<UserEntity>,
    private readonly otp: OtpService,
    private readonly jwt: JwtService,
  ) {}

  requestOtp(phone: string) {
    return this.otp.requestOtp(phone);
  }

  /** First verify for a phone number creates the account — role is picked once and is immutable, ARCHITECTURE.md §2.1. */
  async verifyOtp(phone: string, code: string, role: UserRole) {
    if (!this.otp.verifyOtp(phone, code)) {
      throw new UnauthorizedException('Incorrect or expired code');
    }

    let user = await this.users.findOne({ where: { phone } });
    if (!user) {
      user = this.users.create({
        phone,
        role,
        email: null,
        cnicFrontUrl: null,
        cnicBackUrl: null,
        verificationStatus: 'pending',
        workshopLocation: null,
        ratingAvg: null,
        tier: null,
        walletBalance: 0,
      });
      user = await this.users.save(user);
    }

    const accessToken = this.jwt.sign({ sub: user.id, role: user.role });
    return { accessToken, user };
  }
}
