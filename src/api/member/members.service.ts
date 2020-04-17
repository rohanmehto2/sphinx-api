import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberService } from 'src/repositories/member/member.service';
import { Repository } from 'typeorm';

@Injectable()
export class MembersService {
    constructor(
        private readonly memberService: MemberService
    ) { }

    async updateMember(id, member) {
        return await this.memberService.update(id, member);
    }

    async getMember(id) {
        return await this.memberService.findOne(id);
    }

    async getMembers(query) {
        return await this.memberService.findAll();
    }

    async getMemberByEmail(email) {
        return await this.memberService.getMemberByEmail(email);
    }
}
