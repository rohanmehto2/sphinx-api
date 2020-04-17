import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { Member } from './member.entity'
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member]),
    ConfigModule,
  ],
  providers: [MemberService],
  exports: [MemberService]
})
export class MemberModule { }
