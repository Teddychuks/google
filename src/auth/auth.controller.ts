/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('google'))
  @Get('google')
  async googleAuth(@Req() req) {}

  @UseGuards(AuthGuard('google'))
  @Get('google/redirect')
  async googleAuthRedirect(@Req() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('google'))
  @Get('me')
  async getMe(@Req() req) {
    console.log(req.user?.email);
    const user = await this.authService.findUserByEmail(req.user?.email || '');
    return { ...user, jwt: req.user?.accessToken };
  }
}
