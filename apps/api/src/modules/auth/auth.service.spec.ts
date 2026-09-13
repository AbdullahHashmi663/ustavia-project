import { randomUUID } from 'crypto';

import { NotFoundException, UnauthorizedException } from '@nestjs/common';

import type { UserEntity } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { OtpService } from './otp.service';

/** Same minimal fake-repository shape as jobs.service.spec.ts — no live DB needed to exercise AuthService's own logic. */
function fakeUserRepo() {
  const rows = new Map<string, UserEntity>();
  return {
    create: (data: Partial<UserEntity>): UserEntity => ({ id: data.id ?? randomUUID(), ...data }) as UserEntity,
    save: async (entity: UserEntity): Promise<UserEntity> => {
      rows.set(entity.id, entity);
      return entity;
    },
    findOne: async (query: { where: Partial<UserEntity> }): Promise<UserEntity | null> => {
      const all = [...rows.values()];
      return all.find((row) => Object.entries(query.where).every(([k, v]) => (row as unknown as Record<string, unknown>)[k] === v)) ?? null;
    },
  };
}

describe('AuthService', () => {
  let usersRepo: ReturnType<typeof fakeUserRepo>;
  let service: AuthService;
  const PHONE = '+923001112223';

  beforeEach(() => {
    usersRepo = fakeUserRepo();
    const otp = new OtpService();
    const jwt = { sign: () => 'fake-jwt-token' };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- fakes stand in for TypeORM Repository / JwtService here.
    service = new AuthService(usersRepo as any, otp, jwt as any);
  });

  it('never returns passwordHash in the safe user, even before a password is set', async () => {
    const otp = new OtpService();
    const { devCode } = await otp.requestOtp(PHONE);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- fakes stand in for TypeORM Repository / JwtService here.
    const svc = new AuthService(usersRepo as any, otp, { sign: () => 'fake-jwt-token' } as any);
    const { user } = await svc.verifyOtp(PHONE, devCode, 'customer');
    expect((user as unknown as Record<string, unknown>).passwordHash).toBeUndefined();
    expect(user.passwordSet).toBe(false);
  });

  it('rejects login before any password has been set', async () => {
    const otp = new OtpService();
    const { devCode } = await otp.requestOtp(PHONE);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- fakes stand in for TypeORM Repository / JwtService here.
    const svc = new AuthService(usersRepo as any, otp, { sign: () => 'fake-jwt-token' } as any);
    await svc.verifyOtp(PHONE, devCode, 'customer');

    await expect(svc.loginWithPassword(PHONE, 'whatever')).rejects.toThrow(UnauthorizedException);
  });

  it('rejects login for a phone that was never registered (no enumeration)', async () => {
    await expect(service.loginWithPassword('+923009998888', 'whatever')).rejects.toThrow(UnauthorizedException);
  });

  it('setPassword throws for an unknown user id', async () => {
    await expect(service.setPassword(randomUUID(), 'longenough')).rejects.toThrow(NotFoundException);
  });

  it('lets a user set a password, then log in with it and reject a wrong one', async () => {
    const otp = new OtpService();
    const { devCode } = await otp.requestOtp(PHONE);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- fakes stand in for TypeORM Repository / JwtService here.
    const svc = new AuthService(usersRepo as any, otp, { sign: () => 'fake-jwt-token' } as any);
    const { user } = await svc.verifyOtp(PHONE, devCode, 'customer');

    await svc.setPassword(user.id, 'correct-horse-battery');

    const loggedIn = await svc.loginWithPassword(PHONE, 'correct-horse-battery');
    expect(loggedIn.accessToken).toBe('fake-jwt-token');
    expect(loggedIn.user.passwordSet).toBe(true);
    expect((loggedIn.user as unknown as Record<string, unknown>).passwordHash).toBeUndefined();

    await expect(svc.loginWithPassword(PHONE, 'wrong-password')).rejects.toThrow(UnauthorizedException);
  });

  it("a fresh verifyOtp for the same phone doesn't create a second account or touch the password", async () => {
    const otp = new OtpService();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- fakes stand in for TypeORM Repository / JwtService here.
    const svc = new AuthService(usersRepo as any, otp, { sign: () => 'fake-jwt-token' } as any);
    const first = await svc.verifyOtp(PHONE, (await otp.requestOtp(PHONE)).devCode, 'customer');
    await svc.setPassword(first.user.id, 'a-real-password');

    const second = await svc.verifyOtp(PHONE, (await otp.requestOtp(PHONE)).devCode, 'customer');
    expect(second.user.id).toBe(first.user.id);
    expect(second.user.passwordSet).toBe(true);
  });
});
