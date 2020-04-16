import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { AdminModule } from './api/admin/admin.module'
import { TypeOrmModule } from '@nestjs/typeorm';
import * as ormconfig from './ormconfig';
import { SecretsModule } from './api/secrets/secrets.module';
import { MembersModule } from './api/member/members.module';

@Module({
  imports: [
    ConfigModule,
    AdminModule,
    SecretsModule,
    MembersModule,
    TypeOrmModule.forRoot(ormconfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
