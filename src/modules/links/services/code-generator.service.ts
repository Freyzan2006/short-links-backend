import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LinkEntity } from '../entities/link.entity';


interface ICodeGeneratorService {
  generateUniqueCode(length?: number): Promise<string>;
}

@Injectable()
export class CodeGeneratorService implements ICodeGeneratorService {
  constructor(
    @InjectRepository(LinkEntity)
    private readonly linkRepo: Repository<LinkEntity>,
  ) {}

  public async generateUniqueCode(length = 7): Promise<string> {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code: string;
    let exists: LinkEntity | null = null;

    do {
      code = Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
      exists = await this.linkRepo.findOne({ where: { code } });
    } while (exists);

    return code;
  }
}
