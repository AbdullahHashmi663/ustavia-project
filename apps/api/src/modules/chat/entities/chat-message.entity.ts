import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

/** ARCHITECTURE.md §4 `chat_messages`. `redacted` is true when server-side filtering stripped a phone/email pattern. */
@Entity('chat_messages')
export class ChatMessageEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  jobId!: string;

  @Column({ type: 'uuid' })
  senderId!: string;

  @Column({ type: 'text' })
  body!: string;

  @Column({ type: 'boolean', default: false })
  redacted!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
