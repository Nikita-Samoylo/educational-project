import { ConfigService } from '@nestjs/config';
import { CacheModuleOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

export const getRedisConfig = async (configService: ConfigService): Promise<CacheModuleOptions> => {
  const store = await redisStore({
    socket: {
      host: configService.get('REDIS_HOST') ?? 'localhost',
      port: parseInt(configService.get('REDIS_PORT') ?? '6379'),
    },
    ttl: 30 * 1000, 
  });

  return {
    store: store as any,
  };
};