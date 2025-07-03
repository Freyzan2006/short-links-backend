import { IsOptional, IsString, IsUrl, IsInt, Min } from '@nestjs/class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLinkDto {
  @ApiProperty({ example: 'https://example.com/some/long/url', description: 'Оригинальный URL' })
  @IsUrl()
  originalUrl: string;

  @ApiPropertyOptional({ example: 'my-alias', description: 'Необязательный пользовательский алиас' })
  @IsOptional()
  @IsString()
  alias?: string;

  @ApiPropertyOptional({ example: 24, description: 'TTL в часах (через сколько истекает ссылка)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  ttl?: number; // в часах
}
