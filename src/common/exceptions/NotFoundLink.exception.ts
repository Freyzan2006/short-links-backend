



import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundLinkException extends HttpException {
  constructor(code: string) {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        message: `Ссылка с кодом '${code}' не найдена`,
        error: 'Not Found',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
