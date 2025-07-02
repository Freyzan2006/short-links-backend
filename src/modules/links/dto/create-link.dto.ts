import { IsOptional, IsString, IsUrl, IsInt, Min } from '@nestjs/class-validator';

export class CreateLinkDto {
  @IsUrl()
  originalUrl: string;

  @IsOptional()
  @IsString()
  alias?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  ttl?: number; // в часах
}
