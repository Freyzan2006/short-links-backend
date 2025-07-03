import { Injectable } from "@nestjs/common";


interface ITimeService {
    expiresAt(ttl: number | undefined): Promise<Date | null>
}

@Injectable()
export class TimeService implements ITimeService {

    
    public async expiresAt(ttl: number | undefined): Promise<Date | null> {
        return ttl
          ? new Date(Date.now() + ttl * 60 * 60 * 1000)
          : null;
    }
}