import { Controller, Post, Res, Body, Logger, Get, Param, HttpStatus, Put, Query } from '@nestjs/common';
import { MembersService } from './members.service';

@Controller('member')
export class MembersController {
    constructor(
        private readonly membersService: MembersService
    ) {}

    @Put(':id')
    async updateMember(@Res() res, @Body() body, @Param('id') id) {
        try {
            const member = await this.membersService.updateMember(id, body);

            return res.status(HttpStatus.OK).json({
                message: 'Member updated successfully',
                member,
              });
        } catch (err) {
            Logger.error(err);
            return res.status(HttpStatus.BAD_REQUEST).json({
            message: err.message,
            });
        }
    }

    @Get(':id')
    async getMember(@Res() res, @Param('id') id) {
        try {
            const member = await this.membersService.getMember(id);

            return res.status(HttpStatus.OK).json({
                message: 'Member fetched successfully',
                member
            })
        } catch (err) {
            Logger.error(err);
            return res.status(HttpStatus.BAD_REQUEST).json({
            message: err.message,
            });
        }
    }

    @Get()
    async getMembers(@Res() res, @Query() query) {
        try {
            const members = await this.membersService.getMembers(query);

            return res.status(HttpStatus.OK).json({
                message: 'Members fetched successfully',
                members
            })
        } catch (err) {
            Logger.error(err);
            return res.status(HttpStatus.BAD_REQUEST).json({
            message: err.message,
            });
        }
    }
}
