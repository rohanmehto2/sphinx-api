import { Injectable } from '@nestjs/common';
import { MemberService } from 'src/repositories/member/member.service';

@Injectable()
export class MembersService {
    constructor(
        private readonly memberService: MemberService
    ) {}

    async updateMember(id, member) {
        return await this.memberService.update(id, member);
    }

    async getMember(id) {
        return await this.memberService.findOne(id);
    }

    async getMembers(query) {
        return await this.memberService.findAll();
    }
}
