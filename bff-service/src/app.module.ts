import { Module, HttpModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProxyModule } from './proxy/proxy.module';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule, ProxyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
