import { Controller, Post, Patch, Res, Body, Logger, HttpStatus, Param, Get, UseGuards, Request } from '@nestjs/common';
import { SecretsService } from './secrets.service';
import { MembersService } from '../member/members.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('secret')
export class SecretsController {
    constructor(
        private readonly secretsService: SecretsService,
        private readonly memberService: MembersService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createSecret(@Request() req, @Res() res, @Body() body) {
        try {
            const recipient = await this.memberService.getMemberByEmail(body.recipientEmail);
            const data = {
                receiver: recipient.id,
                secretName: body.secretName,
                secret: body.secret,
                description: body.description,
                ttl: body.ttl,
                creator: req.user.id,
                creatorEmail: req.user.email,
                createdBy: req.user.id,
            };
            const secret = await this.secretsService.createSecret(data);
            return res.status(HttpStatus.OK).json({
                message: 'Secret created successfully',
                secret,
            });
        } catch (err) {
            Logger.error(err);
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: err.message,
            });
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getSecret(@Res() res, @Param('id') id) {
        try {
            const secret = await this.secretsService.getSecret(id);
            return res.status(HttpStatus.OK).json({
                message: 'Secret fetched successfully',
                secret
            })
        } catch (err) {
            Logger.error(err);
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: err.message,
            });
        }
    }
}
