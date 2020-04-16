import { Controller, Post, Patch, Res, Body, Logger, HttpStatus, Param, Get } from '@nestjs/common';
import { SecretsService } from './secrets.service';

@Controller('secret')
export class SecretsController {
    constructor(
        private readonly secretsService: SecretsService
    ) {}

    @Post()
    async createSecret(@Res() res, @Body() body) {
        try {
            Logger.log(body)
            const secret = await this.secretsService.createSecret(body);

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
