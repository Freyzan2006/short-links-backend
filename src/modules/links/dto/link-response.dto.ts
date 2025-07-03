import { ApiProperty } from '@nestjs/swagger';

export class LinkResponseDto {
  @ApiProperty({ example: 'http://localhost:3000/aB1cDeF', description: 'Полный короткий URL' })
  shortUrl: string;

  @ApiProperty({ example: 'aB1cDeF', description: 'Сгенерированный короткий код' })
  code: string;
}
