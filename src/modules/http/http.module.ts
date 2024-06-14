import { Global, Module } from '@nestjs/common';
import { HttpService } from './http.service';
import { HttpModule as AxiosHttpModule } from '@nestjs/axios';

@Global()
@Module({
  imports: [
    AxiosHttpModule.register({
      timeout: 1000 * 5
    })
  ],
  providers: [HttpService],
  exports: [HttpService]
})
export class HttpModule {}
