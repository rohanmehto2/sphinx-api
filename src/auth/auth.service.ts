import { Injectable, Logger } from '@nestjs/common';
import { MembersService } from '../api/member/members.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../config/config.service';
import { TokensService } from './tokens/tokens.service';
import { access } from 'fs';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private membersService: MembersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokensService: TokensService,
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    const member = await this.membersService.getMemberByEmail(email);
    if (member && await this.comparePasswords(pass, member.password)) {
      const { password, ...result } = member;
      return result;
    }
    return null;
  }

  async login(member: any) {
    try {
      const payload = { email: member.email, sub: member.id, name: member.name };
      const accessToken = await this.tokensService.createAccessToken(payload);
      const refreshToken = await this.tokensService.createRefreshToken(payload);

      if (accessToken && refreshToken) {
        return {
          accessToken: accessToken.accessToken,
          jwtPublicKey: accessToken.publicKey,
          refreshToken,
        };
      }
      return null;
    } catch (error) {
      Logger.error(error);
    }
  }

  async logout(refreshToken: any) {
    try {
      await this.tokensService.deleteRefreshToken(refreshToken);
    } catch (error) {
      Logger.log(error.message);
      throw new Error('Error while logging out')
    }
  }

  async comparePasswords(
    plainPassword: any,
    hashedPassword: any
  ): Promise<Boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
