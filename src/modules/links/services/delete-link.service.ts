import { InjectRepository } from "@nestjs/typeorm";
import { LinkEntity } from "../entities/link.entity";
import { Repository } from "typeorm";
import { NotFoundLinkException } from "src/common/exceptions/NotFoundLink.exception";

interface IDeleteLinkService {
    delete(code: string): Promise<void>
}

export class DeleteLinkService implements IDeleteLinkService {
    constructor(
        @InjectRepository(LinkEntity)
        private readonly linkRepo: Repository<LinkEntity>,
    ) {}

    public async delete(code: string): Promise<void> {
        if (!code) {
            throw new NotFoundLinkException('нету такой ссылки');
        }

        
        const deleted = await this.linkRepo.delete({ code });
        
        if (!deleted.affected) {
            throw new NotFoundLinkException(code);
        }
            
        
    }
}