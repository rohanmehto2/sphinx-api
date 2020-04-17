import { Module } from '@nestjs/common';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { MemberModule } from 'src/repositories/member/member.module';
import { MemberService } from 'src/repositories/member/member.service';

@Module({
  imports: [MemberModule],
  controllers: [MembersController],
  providers: [MembersService],
  exports: [MembersService]
})
export class MembersModule { }
