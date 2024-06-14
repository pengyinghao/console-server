import { DynamicModule, ExistingProvider } from '@nestjs/common';
import { TestJob } from './jobs/test.job';
import { baiduJob } from './jobs/baidu.job';
import { Test2Job } from './jobs/test2.job';

const providers = [TestJob, baiduJob, Test2Job];

function createAliasProviders(): ExistingProvider[] {
  const aliasProviders: ExistingProvider[] = [];
  for (const p of providers) {
    aliasProviders.push({
      provide: p.name,
      useExisting: p
    });
  }
  return aliasProviders;
}

export class TaskModule {
  static forRoot(): DynamicModule {
    // 使用Alias定义别名，使得可以通过字符串类型获取定义的Service，否则无法获取
    const aliasProviders = createAliasProviders();
    return {
      global: true,
      module: TaskModule,
      providers: [...providers, ...aliasProviders],
      exports: aliasProviders
    };
  }
}
