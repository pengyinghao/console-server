import { HttpService } from 'src/modules/http/http.service';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Task } from 'src/utility/decorator';

@Injectable()
@Task()
export class baiduJob {
  private readonly logger = new Logger(baiduJob.name);
  @Inject()
  httpService: HttpService;
  async handle(params: any) {
    console.log(params);

    this.logger.log('execute job http');
  }
}
