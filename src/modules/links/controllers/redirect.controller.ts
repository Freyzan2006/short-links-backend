


import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { LinkService } from '../services/links.service';
import { NotFoundLinkException } from 'src/common/exceptions/NotFoundLink.exception';
import { LinkExpiredException } from 'src/common/exceptions/LinkExpired.exception';
import { ClickTrackerService } from '../services/click-tracker.service';

@Controller()
export class RedirectController {
  constructor(
    private readonly linkService: LinkService,
    private readonly clickTracker: ClickTrackerService
  ) {}

  @Get(':code')
  async redirect(@Param('code') code: string, @Res() res: Response) {
    const link = await this.linkService.findByCodeLink(code);

    if (!link) {
      throw new NotFoundLinkException(code);
    }

    // TTL-проверка (если ты не делаешь её в сервисе)
    if (link.expiresAt && link.expiresAt.getTime() < Date.now()) {
      throw new LinkExpiredException(code);
    }

    await this.clickTracker.incrementClick(code);

    return res.redirect(301, link.originalUrl);
  }
}
