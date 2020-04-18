import { Controller, Request, Post, UseGuards, Logger, Get, UnauthorizedException, Query, HttpStatus, Res, Body } from '@nestjs/common';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { TokensService } from 'src/auth/tokens/tokens.service';
import { ExtractJwt } from 'passport-jwt';
import { verify } from 'jsonwebtoken';
import { ConfigService } from 'src/config/config.service';
import { MembersService } from '../member/members.service';

@Controller()
export class LoginController {
  constructor(private readonly authService: AuthService,
    private readonly tokenService: TokensService,
    private readonly configService: ConfigService,
    private readonly membersService: MembersService,
  ) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res() res) {
    try {
      const loginResults = await this.authService.login(req.user);
      if (!loginResults) {
        throw new UnauthorizedException(
          'Please Enter the correct password',
        );
      }
      return res.status(HttpStatus.OK).json({
        message: 'User Logged in.',
        accessToken: loginResults.accessToken,
        jwtPublicKey: loginResults.jwtPublicKey,
        refreshToken: loginResults.refreshToken,
        tokenType: 'bearer',
      })
    } catch (error) {
      Logger.error(error);
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('user-profile')
  async getProfile(@Request() req) {
    return req.user;
  }

  @Post('token')
  async getAccessToken(
    @Request() req,
    @Res() res,
    @Body() body,
  ) {
    try {
      const oldAccessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      const newAccessToken = await this.tokenService.getAccessTokenFromRefreshToken(body.refreshToken, oldAccessToken);
      if (newAccessToken && newAccessToken.status == 404) throw new Error(newAccessToken.message);
      if (!newAccessToken) {
        throw new Error('Refresh Token Could not be generated');
      }
      if (!newAccessToken.accessToken && newAccessToken.message == 'RefreshTokenExpired') {
        return res.status(HttpStatus.UNAUTHORIZED).json(newAccessToken.message);
      }
      if (!newAccessToken.accessToken && newAccessToken.message == 'RefreshTokenNotFound') {
        return res.status(HttpStatus.UNAUTHORIZED).json(newAccessToken.message);
      }
      return res.status(HttpStatus.OK).json({
        message: 'Access Token refreshed',
        accessToken: newAccessToken.accessToken,
        tokenType: 'bearer',
      });
    } catch (error) {
      Logger.error(error)
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @Request() req,
    @Res() res,
    @Body() body,
  ) {
    try {
      if (!body.refreshToken) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Refresh Token not provided.'
        });
      }
      await this.authService.logout(body.refreshToken);
      return res.status(HttpStatus.OK).json({
        message: 'User Logged Out.'
      });
    } catch (error) {
      Logger.error(error.message);
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }

  @Get('validate')
  async checkValidity(
    @Res() res,
    @Query('token') token?: string,
  ) {
    try {
      let ignoreExpiration = false
      const val = await verify(token, this.configService.get('ACCESSKEYSECRETTOKEN'), { ignoreExpiration });
      if (val) {
        return res.status(HttpStatus.OK).json({
          message: 'Token is valid'
        });
      }
    } catch (error) {
      Logger.error(error);
      if (error.name == 'TokenExpiredError') {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          error
        })
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify')
  async verifyPassword(
    @Request() req,
    @Res() res,
    @Body() body,
  ) {
    try {
      const member = await this.membersService.getMemberByEmail(req.user.email);
      if (member && await this.authService.comparePasswords(body.password, member.password)) {
        return res.status(HttpStatus.OK).json({
          message: 'Passwords Match',
        });
      }
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Passwords do not match',
      })
    } catch (error) {
      Logger.error(error.message);
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      })
    }
  }

}
