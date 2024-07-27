import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'argon2';

import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByField('email', email);

    const isMatch = await verify(user.password, pass);
    if (!isMatch) return null;

    return user;
  }

  async login(loginDto: LoginDto) {
    const { id } = await this.usersService.findOneByField(
      'email',
      loginDto.email,
    );

    const payload = { id: id };

    return this.signTokens(payload);
  }

  async refresh(refresh_token: string) {
    try {
      const { id } = this.jwtService.verify(refresh_token, {
        secret: process.env.JWT_SECRET,
      });

      return this.signTokens({ id });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  protected signTokens(payload: any) {
    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '30m',
      }),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: '30d',
      }),
    };
  }

  async register(createUserDto: CreateUserDto) {
    const { id } = await this.usersService.create(createUserDto);
    return this.signTokens({ id });
  }
}
