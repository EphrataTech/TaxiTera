import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}

  async register(dto: { name: string; email: string; password: string; phone?: string }) {
    const existing = await this.users.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already in use');
    const user = await this.users.createUser(dto.name, dto.email, dto.password, dto.phone);
    return this.issueToken(user.id, user.name, user.email);
  }

  async login(dto: { email: string; password: string }) {
    const user = await this.users.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await this.users.validatePassword(user, dto.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return this.issueToken(user.id, user.name, user.email);
  }

  private issueToken(id: string, name: string, email: string) {
    const payload = { sub: id, name, email };
    const accessToken = this.jwt.sign(payload);
    return { accessToken, user: { id, name, email } };
  }
}
