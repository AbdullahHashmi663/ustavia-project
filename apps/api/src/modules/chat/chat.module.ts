import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JobEntity } from '../jobs/entities/job.entity';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatMessageEntity } from './entities/chat-message.entity';

/** Realtime messaging, number/email stripping — see ARCHITECTURE.md §3. */
@Module({
  imports: [TypeOrmModule.forFeature([ChatMessageEntity, JobEntity])],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
