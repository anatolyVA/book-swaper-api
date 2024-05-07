import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

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
    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: true,
    });
    return { access_token };
  }

  // @UseGuards(LocalAuthGuard)
  // @Get('refresh')
  // async refresh(
  //   @Req() request: Request,
  //   @Res({ passthrough: true }) response: Response,
  // ) {
  //   const { refresh_token, access_token} = await this.authServoce.refresh(request.cookies())
  // }
}
