import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { AdminModule } from './api/admin/admin.module'
import { TypeOrmModule } from '@nestjs/typeorm';
import * as ormconfig from './ormconfig';
import { SecretsModule } from './api/secrets/secrets.module';
import { MembersModule } from './api/member/members.module';
import { AuthModule } from './auth/auth.module';
import {LoginModule} from './api/login/login.module';

@Module({
  imports: [
    ConfigModule,
    AdminModule,
    SecretsModule,
    MembersModule,
    TypeOrmModule.forRoot(ormconfig),
    AuthModule,
    LoginModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
