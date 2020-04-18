import { Controller, Post, Res, Body, HttpStatus, Logger, Patch, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';


@Controller('admin')
export class AdminController {
    constructor(
        private readonly adminService: AdminService
    ) { }

    @Post('/member')
    async addMember(@Res() res, @Body() body) {
        try {
            const member = await this.adminService.createMember(body);
            return res.status(HttpStatus.OK).json({
                message: 'Member created successfully',
                member,
            });
        } catch (err) {
            Logger.error(err);
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: err.message,
            });
        }
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/member/:id')
    async deactivateMember(@Res() res, @Param('id') id) {
        try {
            const member = await this.adminService.deactivateMember(id);

            return res.status(HttpStatus.OK).json({
                message: 'Member deactivated successfully',
                member
            })
        } catch (err) {
            Logger.error(err);
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: err.message,
            });
        }
    }

}
