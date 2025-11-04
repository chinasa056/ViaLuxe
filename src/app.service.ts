import { Injectable } from '@nestjs/common';

//comment for commit
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
