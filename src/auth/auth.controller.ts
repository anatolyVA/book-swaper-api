import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { Cookies } from './decorators/cookies.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { refresh_token, access_token } =
      await this.authService.login(loginDto);

    await this.setRefreshTokenCookie(refresh_token, response);

    return { access_token };
  }

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { refresh_token, access_token } =
      await this.authService.register(createUserDto);

    await this.setRefreshTokenCookie(refresh_token, response);

    return { access_token };
  }

  @Get('refresh')
  async refresh(
    @Cookies('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log(refreshToken);

    const { refresh_token, access_token } =
      await this.authService.refresh(refreshToken);

    await this.setRefreshTokenCookie(refresh_token, response);

    return { access_token };
  }

  @Get('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('refresh_token');
    return 'Successfully logged out.';
  }

  private async setRefreshTokenCookie(
    refreshToken: string,
    response: Response,
  ) {
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true, // Set secure only in production
      sameSite: 'none',
    });
  }
}
