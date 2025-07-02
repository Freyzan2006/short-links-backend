import { IsInt, IsOptional, IsString, IsUrl, Min } from "@nestjs/class-validator";



export class LinkDto {

   
    id: number;

    
    code: string;

    @IsOptional()
    @IsString()
    alias: string | null;

    @IsUrl()
    originalUrl: string;


    expiresAt: Date | null;


    createdAt: Date;

    @IsOptional()
    @IsInt()
    @Min(1)
    totalClicks: number;
}
