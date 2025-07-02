import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkEntity } from './entities/link.entity';
import { LinkController } from './controllers/links.controller';
import { LinkService } from './services/links.service';

@Module({
  imports: [TypeOrmModule.forFeature([LinkEntity])],
  controllers: [LinkController],
  providers: [LinkService],
})
export class LinksModule {}
