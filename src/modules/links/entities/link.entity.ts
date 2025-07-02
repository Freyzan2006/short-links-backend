import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

@Entity('links')
export class LinkEntity {

  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'abc123', description: 'Уникальный код для перехода' })
  @Column({ unique: true })
  code: string;

  @ApiProperty({ example: 'custom-alias', nullable: true })
  @Column({ type: 'varchar', nullable: true, unique: true })
  alias: string | null;

  @ApiProperty({ example: 'https://example.com/some-page' })
  @Column({ name: 'original_url', type: 'text' })
  originalUrl: string;

  @ApiProperty({ example: '2025-12-31T23:59:59.000Z', nullable: true })
  @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
  expiresAt: Date | null;

  @ApiProperty({ example: '2025-07-02T19:00:00.000Z' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ example: 42 })
  @Column({ name: 'total_clicks', default: 0 })
  totalClicks: number;
}
