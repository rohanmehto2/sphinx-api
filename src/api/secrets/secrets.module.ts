import { Module } from '@nestjs/common';
import { SecretsController } from './secrets.controller';
import { SecretsService } from './secrets.service';
import { SecretModule } from 'src/repositories/secret/secret.module';

@Module({
  imports: [SecretModule],
  controllers: [SecretsController],
  providers: [SecretsService],
  exports: [SecretsService],
})
export class SecretsModule {}
