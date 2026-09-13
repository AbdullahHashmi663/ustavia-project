import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { CurrentUser } from '../../common/auth/current-user.decorator';
import { JwtAuthGuard, type AuthenticatedRequest } from '../../common/auth/jwt-auth.guard';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';

/** ARCHITECTURE.md §6 flow: `POST /jobs/:id/chat`. Realtime (Socket.IO) delivery lands separately — this is the persisted, redacted REST history. */
@Controller('jobs/:jobId/chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chat: ChatService) {}

  @Get()
  list(@CurrentUser() user: AuthenticatedRequest['user'], @Param('jobId') jobId: string) {
    return this.chat.list(jobId, user.id);
  }

  @Post()
  send(@CurrentUser() user: AuthenticatedRequest['user'], @Param('jobId') jobId: string, @Body() dto: SendMessageDto) {
    return this.chat.send(jobId, user.id, dto.body);
  }
}
