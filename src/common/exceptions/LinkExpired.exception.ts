import { NotFoundException } from '@nestjs/common';

import { HttpStatus } from '@nestjs/common';

export class LinkExpiredException extends NotFoundException {
  constructor(code: string) {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        message: `Срок действия ссылки с кодом '${code}' истёк`,
        error: 'Not Found',
      },
    );
  }
}