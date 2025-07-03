import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LinkEntity } from '../entities/link.entity';
import { Repository } from 'typeorm';


interface IClickTrackerService {
    incrementClick(codeOrAlias: string): Promise<void>;
}

@Injectable()
export class ClickTrackerService implements IClickTrackerService {
  constructor(
    @InjectRepository(LinkEntity)
    private readonly linkRepo: Repository<LinkEntity>,
  ) {}

  async incrementClick(codeOrAlias: string) {
    setImmediate(async () => {
        const link = await this.linkRepo.findOne({
            where: [{ code: codeOrAlias }, { alias: codeOrAlias }],
        });

        if (link) {
        await this.linkRepo.increment({ id: link.id }, 'totalClicks', 1);
        }
    });
  }
}
