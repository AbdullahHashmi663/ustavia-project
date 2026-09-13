import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import type { UserRole } from '@ustavia/shared';

import { UserEntity } from '../users/entities/user.entity';
import { toSafeUser } from '../users/users.service';
import { OtpService } from './otp.service';

const PASSWORD_HASH_ROUNDS = 10;

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
        passwordHash: null,
      });
      user = await this.users.save(user);
    }

    return this.issueSession(user);
  }

  /**
   * Phone + password — no OTP round trip. Only works once `setPassword`
   * has been called for that account; a fresh signup or an account that
   * skipped setting one always falls back to `verifyOtp`.
   */
  async loginWithPassword(phone: string, password: string) {
    const user = await this.users.findOne({ where: { phone } });
    if (!user || !user.passwordHash) {
      // Same message whether the phone doesn't exist or just has no
      // password set — don't let this endpoint be used to enumerate
      // which phone numbers have accounts.
      throw new UnauthorizedException('Incorrect phone or password');
    }
    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) throw new UnauthorizedException('Incorrect phone or password');

    return this.issueSession(user);
  }

  /** Sets/changes the caller's password — requires an already-authenticated session (via OTP or an existing password), so this is never how an account gets its *first* credential. */
  async setPassword(userId: string, password: string) {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    user.passwordHash = await bcrypt.hash(password, PASSWORD_HASH_ROUNDS);
    await this.users.save(user);
    return { ok: true };
  }

  private issueSession(user: UserEntity) {
    const accessToken = this.jwt.sign({ sub: user.id, role: user.role });
    return { accessToken, user: toSafeUser(user) };
  }
}
