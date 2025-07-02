import { ConflictException, Injectable } from '@nestjs/common';
import { LinkEntity } from '../entities/link.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLinkDto } from '../dto/create-link.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LinkService {
  constructor(
    @InjectRepository(LinkEntity)
    private readonly linkRepo: Repository<LinkEntity>,
    private configService: ConfigService
  ) {}



  async createShortLink(dto: CreateLinkDto): Promise<string> {
    const { originalUrl, alias, ttl } = dto;

    // Проверка alias
    if (alias) {
      const exists = await this.linkRepo.findOne({ where: { alias } });
      if (exists) {
        throw new ConflictException('Alias already in use');
      }
    }

    // Генерация уникального кода
    const code = alias ?? this.generateUniqueCode();

    const expiresAt = ttl
      ? new Date(Date.now() + ttl * 60 * 60 * 1000)
      : null;

    const entity = this.linkRepo.create({
      originalUrl,
      alias: alias ?? null,
      code,
      expiresAt,
    });

    await this.linkRepo.save(entity);

    const originUrl = this.configService.get<string>('HOST');
    if (originUrl) {
      return `${originUrl}/${code}`;
    }

    return `http://localhost:8000/${code}`;
  }

  private generateUniqueCode(length = 7): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  public async getLink(code: string): Promise<LinkEntity> {
    const link = await this.linkRepo.findOne({ where: { code } });
    if (!link) {
      throw new ConflictException('Link not found');
    }
    return link;
  }
}

