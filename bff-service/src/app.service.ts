import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStartPage(): any {
    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
    };
  }
}
