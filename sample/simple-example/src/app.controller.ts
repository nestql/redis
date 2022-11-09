import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(@Query('name') name: string): Promise<string> {
    await this.appService.setName(name || 'default');
    return this.appService.getName();
  }
}
