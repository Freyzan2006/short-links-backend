import { Body, Controller, Get, Post } from '@nestjs/common';
import { LinkService } from '../services/links.service';
import { CreateLinkDto } from '../dto/create-link.dto';
import { LinkDto } from '../dto/link.dto';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('links')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Post()
  async create(@Body() dto: CreateLinkDto) {
    const shortUrl = await this.linkService.createShortLink(dto);
    return { shortUrl };
  }

  @ApiOkResponse({ type: LinkDto })
  @Get(":code")
  async getLinks(code: string) {
    return this.linkService.getLink(code);
  }
}
