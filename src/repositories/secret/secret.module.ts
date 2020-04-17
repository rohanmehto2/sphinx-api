import { Module } from '@nestjs/common';
import { SecretService } from './secret.service';
import { Secret } from './secret.entity'
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Secret]),
    ConfigModule,
  ],
  providers: [SecretService],
  exports: [SecretService],
})
export class SecretModule { }
