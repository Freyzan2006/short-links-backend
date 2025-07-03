import { InjectRepository } from "@nestjs/typeorm";
import { LinkEntity } from "../entities/link.entity";
import { Repository } from "typeorm";
import { CreateLinkDto } from "../dto/create-link.dto";
import { ConfigService } from "@nestjs/config";
import { CodeGeneratorService } from "src/modules/links/services/code-generator.service";
import { TimeService } from "src/common/services/time.service";
import { AliasAlreadyExistsException } from "src/common/exceptions/AliasAlreadyExists.exception";
import { Injectable } from "@nestjs/common";


interface ICreateLinkService {
    createShortLink(dto: CreateLinkDto): Promise<string>;
}


@Injectable()
export class CreateLinkService implements ICreateLinkService {
  
    constructor(
        @InjectRepository(LinkEntity)
        private readonly linkRepo: Repository<LinkEntity>,
        private readonly configService: ConfigService,
        private readonly codeGeneratorService: CodeGeneratorService,
        private readonly timeService: TimeService
    ) {}

    public async createShortLink(dto: CreateLinkDto): Promise<string> {
        const { originalUrl, alias, ttl } = dto;
    
      
        if (alias) {
          const exists = await this.linkRepo.findOne({ where: { alias } });
          if (exists) {
            throw new AliasAlreadyExistsException(alias);
          }
        }

        const code = alias ?? await this.codeGeneratorService.generateUniqueCode();
    
        const expiresAt = await this.timeService.expiresAt(ttl);
    
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
    
        return `http://localhost:3000/${code}`;
      }
    
    
}