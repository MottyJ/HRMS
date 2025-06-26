import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('health')
  getHealth(): { status: 'ok' } {
    return { status: 'ok' };
  }
}
