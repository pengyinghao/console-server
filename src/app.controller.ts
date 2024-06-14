import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Allow } from './utility/decorator/allow-anonymous.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Allow()
  getHello(): string {
    console.log(this);
    return this.appService.getHello();
  }

  public testJob() {
    console.log('test job');
  }
}
