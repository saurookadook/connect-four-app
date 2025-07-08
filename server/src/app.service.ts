import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  #gameType: string = 'Connect Four';

  getHello(): string {
    return 'Hello World!';
  }

  get gameType(): string {
    return this.#gameType;
  }
}
