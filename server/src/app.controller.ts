import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  @Get()
  getHello() {
    return { message: 'TaxiTera API is running!', timestamp: new Date().toISOString() };
  }

  @Get('health')
  getHealth() {
    return { status: 'OK', service: 'TaxiTera API' };
  }

  @Get('test-auth')
  @UseGuards(AuthGuard('jwt'))
  testAuth(@Req() req: any) {
    return { message: 'Auth working!', user: req.user };
  }
}