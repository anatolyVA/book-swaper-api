import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';

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

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { refresh_token, access_token } =
      await this.authService.register(createUserDto);
    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: true,
    });
    return { access_token };
  }

  @Get('refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { refresh_token, access_token } = await this.authService.refresh(
      request.cookies['refresh_token'],
    );
    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: true,
    });
    return { access_token };
  }

  @Get('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('refresh_token');
    return 'Successfully logged out.';
  }
}
