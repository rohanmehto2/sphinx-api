import { Module } from '@nestjs/common';
import { SecretsController } from './secrets.controller';
import { SecretsService } from './secrets.service';
import { SecretModule } from 'src/repositories/secret/secret.module';
import { MembersModule } from '../member/members.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [SecretModule, MembersModule, AuthModule],
  controllers: [SecretsController],
  providers: [SecretsService],
  exports: [SecretsService],
})
export class SecretsModule { }
