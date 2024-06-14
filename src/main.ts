import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as Session from 'express-session';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger(bootstrap.name);

  const config = app.get(ConfigService);

  /** resave:为true是每次访问都会更新 session，不管有没有修改 session 的内容，而 false 是只有 session 内容变了才会去更新 session。
    saveUninitalized:设置为 true 是不管是否设置 session，都会初始化一个空的 session 对象。比如你没有登录的时候，也会初始化一个 session 对象，这个设置为 false 就好。
   */
  app.use(
    Session({
      secret: 'server',
      resave: false,
      saveUninitialized: false
    })
  );

  // 设置访问频率
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15分钟
      max: 10000 // 限制15分钟内最多只能访问1000次
    })
  );

  // web 安全，防常见漏洞
  // 注意： 开发环境如果开启 nest static module 需要将 crossOriginResourcePolicy 设置为 false 否则 静态资源 跨域不可访问
  app.use(
    helmet({
      crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
      crossOriginResourcePolicy: false,
      contentSecurityPolicy: false
    })
  );

  app.setGlobalPrefix(config.get<string>('application.prefix'));

  if (process.env.NODE_ENV === 'development') {
    app.enableCors(); // 允许跨域
  }

  app.useStaticAssets(join(__dirname, '..', 'public'), { prefix: '/' });
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/'
  });

  const port = config.get<number>('application.port', 3000);

  await app.listen(port);

  logger.log(`server runing on http://localhost:${port}`);
}
bootstrap();
