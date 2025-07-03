import { Inject, Injectable } from '@nestjs/common';
import { LinkEntity } from '../entities/link.entity';
import { IsNull, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { NotFoundLinkException } from 'src/common/exceptions/NotFoundLink.exception';
import { LinkExpiredException } from 'src/common/exceptions/LinkExpired.exception';

import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cached } from 'src/common/decorators/cached.decorator';


interface ILinkService {
  findByCodeLink(codeOrAlias: string): Promise<LinkEntity>;
  getLinks(): Promise<LinkEntity[]>
}


@Injectable()
export class LinkService implements ILinkService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(LinkEntity)
    private readonly linkRepo: Repository<LinkEntity>,
  
  ) {}


  public async findByCodeLink(codeOrAlias: string): Promise<LinkEntity> {
    const link = await this.linkRepo.findOne({
      where: [{ code: codeOrAlias }, { alias: codeOrAlias }],
    });
    

    if (!link) {
      throw new NotFoundLinkException(codeOrAlias);
    }

    if (link.expiresAt && link.expiresAt.getTime() < Date.now()) {
      throw new LinkExpiredException(codeOrAlias);
    }

    return link;
  }

  
  public async getLinks(): Promise<LinkEntity[]> {
    const cacheKey = 'getLinks';
    const cached: LinkEntity[] | undefined = await this.cacheManager.get(cacheKey);
    if (cached) {
      console.log('🔁 Данные из Redis');
      return cached;
    }

    const links = await this.linkRepo.find({
      where: [{ expiresAt: IsNull() }, { expiresAt: MoreThan(new Date()) }],
      order: { createdAt: 'DESC' },
    });

    if (links.length === 0) {
      throw new NotFoundLinkException("Нету ссылок в сервисе");
    }

    await this.cacheManager.set(cacheKey, JSON.stringify(links), 60);
    console.log('✅ Кэш установлен:', await this.cacheManager.get(cacheKey));


    return links;
  }


}

