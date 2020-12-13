import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProxyController } from './proxy.controller';
import { ProxyService } from './proxy.service';
import { CacheService } from './cache.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [ProxyController],
  providers: [ProxyService, CacheService],
})
export class ProxyModule {}
