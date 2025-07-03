import { Module } from '@nestjs/common';
import { IndexModule } from './modules';
import { DatabaseModule } from './infrastructures/db/database.module';
import { AppConfigModule } from './common/config/app-config.module';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { RedisCacheModule } from './infrastructures/radis/radis.module';



@Module({
  imports: [
    IndexModule, 
    DatabaseModule,
    AppConfigModule,
    // ConfigModule.forRoot({
    //   isGlobal: true, // Делает ConfigModule глобальным
    // }),

    RedisCacheModule,
    
    // CacheModule.registerAsync({
    //   isGlobal: true,
    //   useFactory: async () => {
    //     const store = await redisStore({
    //       url: 'redis://localhost:6379',
    //       ttl: 3,
    //     });
    //     console.log('Redis store initialized:', store !== null);
    //     return { store };
    //   },
    // }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
