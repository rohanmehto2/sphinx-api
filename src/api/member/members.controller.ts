import { Controller, Post, Res, Body, Logger, Get, Param, HttpStatus, Put, Query, UseGuards, Request } from '@nestjs/common';
import { MembersService } from './members.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Controller('member')
export class MembersController {
    constructor(
        private readonly membersService: MembersService
    ) { }

    @UseGuards(JwtAuthGuard)
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

    @UseGuards(JwtAuthGuard)
    @Get(':email')
    async getMemberByEmail(@Res() res, @Param('email') email) {
        try {
            const member = await this.membersService.getMemberByEmail(email);
            Logger.log(member)
            if (!member) {
                return res.status(HttpStatus.NOT_FOUND).json({
                    message: 'Member not found',
                });
            }
            return res.status(HttpStatus.OK).json({
                message: 'Member Found Successfully',
                member
            });
        } catch (error) {
            Logger.error(error);
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: error.message,
            });
        }
    }

    @UseGuards(JwtAuthGuard)
    @Put(':email')
    async updateMemberByEmail(
        @Res() res,
        @Request() req,
        @Param('email') email,
        @Body() body) {
        try {
            if (body.password) {
                let hashedPassword = await bcrypt.hash(body.password, 10);
                body.password = hashedPassword;
            }
            const member = await this.membersService.updateMember(req.user.id, body);
            return res.status(HttpStatus.OK).json({
                message: 'Member updated successfully',
                member,
            });
        } catch (error) {
            Logger.error(error)
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: error.message,
            });
        }
    }
    // @UseGuards(JwtAuthGuard)
    // @Put(':id')
    // async updateMember(@Res() res, @Body() body, @Param('id') id) {
    //     try {
    //         const member = await this.membersService.updateMember(id, body);

    //         return res.status(HttpStatus.OK).json({
    //             message: 'Member updated successfully',
    //             member,
    //           });
    //     } catch (err) {
    //         Logger.error(err);
    //         return res.status(HttpStatus.BAD_REQUEST).json({
    //         message: err.message,
    //         });
    //     }
    // }

    //@UseGuards(JwtAuthGuard)
    // @Get(':id')
    // async getMember(@Res() res, @Param('id') id) {
    //     try {
    //         const member = await this.membersService.getMember(id);

    //         return res.status(HttpStatus.OK).json({
    //             message: 'Member fetched successfully',
    //             member
    //         })
    //     } catch (err) {
    //         Logger.error(err);
    //         return res.status(HttpStatus.BAD_REQUEST).json({
    //         message: err.message,
    //         });
    //     }
    // }

}
