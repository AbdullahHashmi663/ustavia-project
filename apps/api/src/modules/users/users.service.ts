import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './entities/user.entity';
import type { UpdateMeDto } from './dto/update-me.dto';

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
}
