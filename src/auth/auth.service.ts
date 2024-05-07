import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'argon2';

import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByField('email', email);

    const isMatch = await verify(user.password, pass);
    if (isMatch) {
      const { password, ...result } = user;
      console.log(password);
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const { id, email } = await this.usersService.findOneByField(
      'email',
      loginDto.email,
    );

    const payload = { email, sub: id };

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: '30d',
      }),
    };
  }
}
