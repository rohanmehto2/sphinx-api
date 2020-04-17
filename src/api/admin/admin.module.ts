import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MemberModule } from 'src/repositories/member/member.module';

@Module({
  imports: [MemberModule],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule { }
