import { Injectable } from '@nestjs/common';
import { MemberService } from 'src/repositories/member/member.service';

@Injectable()
export class AdminService {
    constructor(
        private readonly memberService: MemberService
    ) { }

    async createMember(member) {
        return await this.memberService.save(member);
    }

    async deactivateMember(id) {
        return await this.memberService.update(id, { active: false });
    }
}
