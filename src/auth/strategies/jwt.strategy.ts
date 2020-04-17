import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as fs from 'fs';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: fs.readFileSync(configService.get('ACCESS_TOKEN_PUBLIC_KEY')),
    });
  }

  async validate(payload: any) {
    return { id: payload.sub, email: payload.email, name: payload.name };
  }
}           