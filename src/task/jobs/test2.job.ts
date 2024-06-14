import { Injectable, Logger } from '@nestjs/common';
import { Task } from 'src/utility/decorator';

@Injectable()
@Task()
export class Test2Job {
  private readonly logger = new Logger(Test2Job.name);
  async test() {
    this.logger.log('execute job2');
  }
}
