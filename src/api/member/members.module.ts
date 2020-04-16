import { Module } from '@nestjs/common';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { MemberModule } from 'src/repositories/member/member.module';

@Module({
  imports: [MemberModule],
  controllers: [MembersController],
  providers: [MembersService]
})
export class MembersModule {}
