import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  @Get()
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req: any) {
    return { user: req.user, message: 'Auth working!' };
  }
}