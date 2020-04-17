import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TokenService } from 'src/repositories/token/token.service';
import { randomBytes } from 'crypto';
import * as moment from 'moment';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from 'src/config/config.service';
import { verify, sign } from 'jsonwebtoken';
import { JwtPayload } from '../jwt-payload';
import { log } from 'util';
import * as fs from 'fs';

@Injectable()
export class TokensService {
    constructor(
        private readonly tokenService: TokenService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    async createRefreshToken(payload: any) {
        try {
            const refreshToken = randomBytes(64).toString('hex');
            const data = {
                userId: payload.sub,
                value: refreshToken,
                expiresAt: moment().add(90, 'd').toDate(),
            };
            let result = await this.tokenService.save(data);
            return refreshToken;
        } catch (error) {
            Logger.error(error);
        }
    }

    async createAccessToken(payload: any) {
        try {
            const privateKey = fs.readFileSync(this.configService.get('ACCESS_TOKEN_PRIVATE_KEY'));
            const publicKey = fs.readFileSync(this.configService.get('ACCESS_TOKEN_PUBLIC_KEY'));
            const accessToken = await sign(
                payload,
                privateKey,
                {
                    algorithm: 'RS256',
                    expiresIn: this.configService.get('ACCESS_TOKEN_TIMEOUT')
                });
            return {
                accessToken,
                publicKey: publicKey.toString('utf8'),
            };
        } catch (error) {
            Logger.error(error.message)
        }
    }

    async getAccessTokenFromRefreshToken(refreshToken: any, oldAccessToken: any) {
        try {
            const token = await this.tokenService.getToken(refreshToken);
            if (!token) {
                throw new NotFoundException('RefreshTokenNotFound');
            }
            const currentDate = new Date();
            if (token.expiresAt < currentDate) {
                throw new Error('RefreshTokenExpired');
            }
            const oldPayload = await this.validateToken(oldAccessToken, true);
            delete oldPayload.iat;
            delete oldPayload.exp;

            const accessToken = await this.createAccessToken(oldPayload);
            if (accessToken) return { accessToken: accessToken.accessToken };
        } catch (error) {
            Logger.error(error.message)
            return error;
        }
    }

    async deleteRefreshToken(refreshToken: any) {
        const token = await this.tokenService.getToken(refreshToken);
        await this.tokenService.delete(token.id)
    }

    private async validateToken(token: any, ignoreExpiration = false): Promise<JwtPayload> {
        try {
            const publicKey = fs.readFileSync(this.configService.get('ACCESS_TOKEN_PUBLIC_KEY'));
            return verify(token, publicKey, {
                ignoreExpiration
            }) as JwtPayload;
        } catch (error) {
            Logger.error(error)
        }
    }
}
