import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './entities/user.entity';
import type { UpdateMeDto } from './dto/update-me.dto';

/** `UserEntity` minus `passwordHash`, plus a `passwordSet` flag so a client can offer "set up a password" only once. Every response that carries a full user object goes through `toSafeUser` first — the hash itself must never reach a client. */
export type SafeUser = Omit<UserEntity, 'passwordHash'> & { passwordSet: boolean };

export function toSafeUser(user: UserEntity): SafeUser {
  const { passwordHash, ...safe } = user;
  return { ...safe, passwordSet: passwordHash != null };
}

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UserEntity) private readonly users: Repository<UserEntity>) {}

  async findByIdOrThrow(id: string): Promise<UserEntity> {
    const user = await this.users.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateMe(id: string, dto: UpdateMeDto): Promise<UserEntity> {
    const user = await this.findByIdOrThrow(id);
    if (dto.email !== undefined) user.email = dto.email;
    if (dto.cnicFrontUrl !== undefined) user.cnicFrontUrl = dto.cnicFrontUrl;
    if (dto.cnicBackUrl !== undefined) user.cnicBackUrl = dto.cnicBackUrl;
    if (dto.workshopLocation !== undefined) user.workshopLocation = dto.workshopLocation;
    return this.users.save(user);
  }

  /**
   * The safe subset of another user's profile — no `phone`/`email`/CNIC
   * urls. ARCHITECTURE.md §7: "Phone numbers and emails are visible only
   * to Ustavia's backend/CRM, never to the counterparty" — so a job's
   * other party is looked up through this, never `findByIdOrThrow`.
   */
  async findPublicProfile(id: string): Promise<Pick<UserEntity, 'id' | 'role' | 'ratingAvg' | 'tier' | 'verificationStatus'>> {
    const user = await this.findByIdOrThrow(id);
    return { id: user.id, role: user.role, ratingAvg: user.ratingAvg, tier: user.tier, verificationStatus: user.verificationStatus };
  }
}
