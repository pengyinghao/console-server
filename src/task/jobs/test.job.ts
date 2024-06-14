import { Injectable, Logger } from '@nestjs/common';
import { Task } from 'src/utility/decorator';

@Injectable()
@Task()
export class TestJob {
  private readonly logger = new Logger(TestJob.name);
  async test() {
    this.logger.log('execute job13');
  }
}
