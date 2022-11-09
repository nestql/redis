import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '@nestql/redis';
import Redis from 'ioredis';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private readonly client: Redis;

  constructor(private readonly redisService: RedisService) {
    this.client = redisService.getClient();
  }

  async getName(): Promise<string> {
    return this.client.get('name');
  }

  async setName(name: string) {
    return this.client.set('name', name);
  }
}
