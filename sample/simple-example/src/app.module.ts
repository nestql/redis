import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from '@nestql/redis';

@Module({
  imports: [
    RedisModule.register([
      {
        name: 'test1',
        url: 'redis://:authpassword@127.0.0.1:6380/4',
      },
      {
        name: 'test2',
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        db: parseInt(process.env.REDIS_DB),
        password: process.env.REDIS_PASSWORD,
        keyPrefix: process.env.REDIS_PRIFIX,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
