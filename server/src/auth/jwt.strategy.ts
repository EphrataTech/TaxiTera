import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || '6LIVDu8zQ6vqplVc0ZOtRvNPoWfU1TcMoKIy7uXY4iw',
    });
  }

  async validate(payload: { sub: string; email: string; name: string }) {
    return { userId: payload.sub, email: payload.email, name: payload.name };
  }
}