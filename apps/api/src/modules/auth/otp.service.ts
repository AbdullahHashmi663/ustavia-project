import { Injectable } from '@nestjs/common';

interface OtpRecord {
  code: string;
  expiresAt: number;
  attempts: number;
}

const OTP_TTL_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 5;

/**
 * In-memory OTP store — fine for a single-process dev/MVP deployment; move
 * to Redis (already in the architecture for realtime, ARCHITECTURE.md §2.4)
 * before running more than one API instance, since codes issued on one
 * instance wouldn't be visible to a request that lands on another.
 *
 * SMS_PROVIDER_API_KEY (.env.example) isn't wired up yet — until it is,
 * `requestOtp` returns the generated code directly in the API response so
 * the flow is genuinely testable end-to-end. That return value must be
 * removed the moment a real SMS provider call replaces it.
 */
@Injectable()
export class OtpService {
  private readonly codesByPhone = new Map<string, OtpRecord>();

  requestOtp(phone: string): { devCode: string; expiresInSeconds: number } {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.codesByPhone.set(phone, { code, expiresAt: Date.now() + OTP_TTL_MS, attempts: 0 });
    return { devCode: code, expiresInSeconds: OTP_TTL_MS / 1000 };
  }

  verifyOtp(phone: string, code: string): boolean {
    const record = this.codesByPhone.get(phone);
    if (!record) return false;
    if (Date.now() > record.expiresAt) {
      this.codesByPhone.delete(phone);
      return false;
    }
    record.attempts += 1;
    if (record.attempts > MAX_ATTEMPTS) {
      this.codesByPhone.delete(phone);
      return false;
    }
    const ok = record.code === code;
    if (ok) this.codesByPhone.delete(phone);
    return ok;
  }
}
