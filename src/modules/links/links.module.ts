import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkEntity } from './entities/link.entity';
import { LinkController } from './controllers/links.controller';
import { LinkService } from './services/links.service';
import { DeleteLinkService } from './services/delete-link.service';
import { CreateLinkService } from './services/create-link.service';
import { CodeGeneratorService } from 'src/modules/links/services/code-generator.service';
import { TimeService } from 'src/common/services/time.service';

import { CommonModule } from 'src/common/common.module';
import { RedirectController } from './controllers/redirect.controller';
import { ClickTrackerService } from './services/click-tracker.service';

@Module({
  imports: [TypeOrmModule.forFeature([LinkEntity]), CommonModule],
  controllers: [
    LinkController,
    RedirectController
  ],
  providers: [
    LinkService, CodeGeneratorService, 
    CreateLinkService, DeleteLinkService,
    TimeService, ClickTrackerService
  ],
})
export class LinksModule {}
