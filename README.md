
<p align="center">
  <a href="http://nestql.com/" target="blank"><img src="https://raw.githubusercontent.com/nestql/redis/main/assets/screenshot.png"  alt="NestQL redis screenshot" /></a>
</p>
<p align="center">
    <a href="https://www.npmjs.com/package/@nestql/redis"><img src="https://img.shields.io/npm/v/@nestql/redis.svg" alt="NPM Version" /></a>
    <a href="https://www.npmjs.com/package/@nestql/redis"><img src="https://img.shields.io/npm/l/@nestql/redis.svg" alt="Package License" /></a>
    <a href="https://www.npmjs.com/package/@nestql/redis"><img src="https://img.shields.io/npm/dm/@nestql/redis.svg" alt="NPM Downloads" /></a>
</p>

## Description

Strongly typed and easily configurable Nest.js module for [ioredis](https://www.npmjs.com/package/ioredis) package – a robust, performance-focused and full-featured [Redis](http://redis.io) client for [Node.js](https://nodejs.org).

>Supports Redis >= 2.6.12 and (Node.js >= 12.22.0). Completely compatible with Redis 7.x.

## Installation

```bash
$ npm i --save @nestql/redis ioredis
```

## Quick Start

Add module to your AppModule imports:

> 🎁 A working example is available at [sample folder](https://github.com/nestql/bull-board/tree/main/sample).

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { RedisModule } from '@nestql/redis';

@Module({
    imports: [
        RedisModule.register({
            host: 'localhost',
            port: 6379,
        }),
    ]
})
export class AppModule {}
```

Then use RedisService to get configured client instance in your service or controller.
```typescript
// app.service.ts
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
```

## Advanced configurations

#### Async module configuration:

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { RedisModule } from '@nestql/redis';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => configService.get('redis'),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

#### Multiple clients (named configurations):

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { RedisModule } from '@nestql/redis';

@Module({
  imports: [
    RedisModule.register([
      {
        name: 'redis-cache',
        url: 'redis://:authpassword@127.0.0.1:6380/4',
      },
      {
        name: 'redis-pubsub',
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        db: parseInt(process.env.REDIS_DB),
        password: process.env.REDIS_PASSWORD,
        keyPrefix: process.env.REDIS_PRIFIX,
      },
    ]),
  ],
})
export class AppModule {}
```

```typescript
// app.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '@nestql/redis';
import Redis from 'ioredis';

@Injectable()
export class AppService {
  private readonly cacheClient: Redis;
  private readonly pubsubClient: Redis;

  constructor(private readonly redisService: RedisService) {
    this.cacheClient = redisService.getClient('redis-cache');
    this.pubsubClient = redisService.getClient('redis-pubsub');
  }
}
```

## Custom options 


```typescript
interface RedisOptions {
    /**
     * client name. default is a uuid, unique.
     */
    name?: string;
    url?: string;
    port?: number;
    host?: string;
    /**
     * 4 (IPv4) or 6 (IPv6), Defaults to 4.
     */
    family?: number;
    /**
     * Local domain socket path. If set the port, host and family will be ignored.
     */
    path?: string;
    /**
     * TCP KeepAlive on the socket with a X ms delay before start. Set to a non-number value to disable keepAlive.
     */
    keepAlive?: number;
    connectionName?: string;
    /**
     * If set, client will send AUTH command with the value of this option when connected.
     */
    password?: string;
    /**
     * Database index to use.
     */
    db?: number;
    /**
     * When a connection is established to the Redis server, the server might still be loading
     * the database from disk. While loading, the server not respond to any commands.
     * To work around this, when this option is true, ioredis will check the status of the Redis server,
     * and when the Redis server is able to process commands, a ready event will be emitted.
     */
    enableReadyCheck?: boolean;
    keyPrefix?: string;
    /**
     * When the return value isn't a number, ioredis will stop trying to reconnect.
     * Fixed in: https://github.com/DefinitelyTyped/DefinitelyTyped/pull/15858
     */
    retryStrategy?(times: number): number | false;
    /**
     * By default, all pending commands will be flushed with an error every
     * 20 retry attempts. That makes sure commands won't wait forever when
     * the connection is down. You can change this behavior by setting
     * `maxRetriesPerRequest`.
     *
     * Set maxRetriesPerRequest to `null` to disable this behavior, and
     * every command will wait forever until the connection is alive again
     * (which is the default behavior before ioredis v4).
     */
    maxRetriesPerRequest?: number | null;
    /**
     * 1/true means reconnect, 2 means reconnect and resend failed command. Returning false will ignore
     * the error and do nothing.
     */
    reconnectOnError?(error: Error): boolean | 1 | 2;
    /**
     * By default, if there is no active connection to the Redis server, commands are added to a queue
     * and are executed once the connection is "ready" (when enableReadyCheck is true, "ready" means
     * the Redis server has loaded the database from disk, otherwise means the connection to the Redis
     * server has been established). If this option is false, when execute the command when the connection
     * isn't ready, an error will be returned.
     */
    enableOfflineQueue?: boolean;
    /**
     * The milliseconds before a timeout occurs during the initial connection to the Redis server.
     * default: 10000.
     */
    connectTimeout?: number;
    /**
     * After reconnected, if the previous connection was in the subscriber mode, client will auto re-subscribe these channels.
     * default: true.
     */
    autoResubscribe?: boolean;
    /**
     * If true, client will resend unfulfilled commands(e.g. block commands) in the previous connection when reconnected.
     * default: true.
     */
    autoResendUnfulfilledCommands?: boolean;
    lazyConnect?: boolean;
    tls?: tls.ConnectionOptions;
    sentinels?: Array<{ host: string; port: number; }>;
    name?: string;
    /**
     * Enable READONLY mode for the connection. Only available for cluster mode.
     * default: false.
     */
    readOnly?: boolean;
    /**
     * If you are using the hiredis parser, it's highly recommended to enable this option.
     * Create another instance with dropBufferSupport disabled for other commands that you want to return binary instead of string
     */
    dropBufferSupport?: boolean;
    /**
     * Whether to show a friendly error stack. Will decrease the performance significantly.
     */
    showFriendlyErrorStack?: boolean;
}
```

## Acknowledgements 🖤

> This package inspired by original [nestjs-redis](https://github.com/skunight/nestjs-redis) package. Thanks a lot for their work to [skunight](https://github.com/skunight) and other [contributors](https://github.com/skunight/nestjs-redis/graphs/contributors).

## License

NestQL Redis is [MIT licensed](LICENSE).
