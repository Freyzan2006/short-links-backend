import { Body, Controller, Delete, Get, Inject, Post, UseInterceptors } from '@nestjs/common';
import { LinkService } from '../services/links.service';
import { CreateLinkDto } from '../dto/create-link.dto';

import { ApiOkResponse } from '@nestjs/swagger';

import { Param } from '@nestjs/common';


import { LinkDto } from '../dto/link.dto';
import { ApiTags, ApiCreatedResponse, ApiBody, ApiParam, ApiOperation } from '@nestjs/swagger';
import { LinkEntity } from '../entities/link.entity';
import { CreateLinkService } from '../services/create-link.service';
import { DeleteLinkService } from '../services/delete-link.service';

import { CacheKey, CacheTTL } from '@nestjs/cache-manager';

@ApiTags('links')
@Controller('links')
export class LinkController {
  constructor(
    private readonly linkService: LinkService,
    private readonly createLinkService: CreateLinkService,
    private readonly deleteLinkService: DeleteLinkService
    
  ) {}

  @Post()
  @ApiOperation({ summary: 'Создать короткую ссылку' })
  @ApiCreatedResponse({
    schema: {
      example: {
        shortUrl: 'http://localhost:3000/aB1cDeF',
      },
    },
    description: 'Создаёт короткую ссылку и возвращает её',
  })
  @ApiBody({ type: CreateLinkDto })
  async create(@Body() dto: CreateLinkDto) {
    try {
      return this.createLinkService.createShortLink(dto);
    } catch (error) {
      throw error;
    }
  }

  @Get(':code')
  @ApiOperation({ summary: 'Получить оригинальную ссылку по коду' })
  @ApiOkResponse({ type: LinkDto })
  @ApiParam({ name: 'code', example: 'aB1cDeF', description: 'Короткий код ссылки' })
  async findByCodeLink(@Param('code') code: string) {
    try {
      return this.linkService.findByCodeLink(code);
    } catch (error) {
      throw error;
    }
    
  }

 
  @Get()
  // @CacheKey('links_all')
  // @CacheTTL(120)
  @ApiOperation({ summary: 'Получить список всех ссылок' })
  @ApiOkResponse({ type: [LinkDto] })
  async getLinks(): Promise<LinkEntity[]> {
    
    return this.linkService.getLinks();
  }

  @Delete(':code')
  @ApiOperation({ summary: 'Удалить ссылку по коду' })
  @ApiParam({ name: 'code', example: 'aB1cDeF', description: 'Короткий код ссылки' })
  async deleteLink(@Param('code') code: string) {
    try {
      return this.deleteLinkService.delete(code);
    } catch (error) {
      throw error;
    }
  }
}
