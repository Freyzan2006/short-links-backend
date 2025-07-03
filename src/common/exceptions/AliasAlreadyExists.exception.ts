import { HttpException, HttpStatus } from '@nestjs/common';

export class AliasAlreadyExistsException extends HttpException {
  constructor(alias: string) {
    super(
      {
        statusCode: HttpStatus.CONFLICT,
        message: `Alias '${alias}' уже используется`,
        error: 'Conflict',
      },
      HttpStatus.CONFLICT,
    );
  }
}