import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'argon2';

import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { jwtConstants } from './constants';
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

    return this.signTokens(payload);
  }

  async refresh(refresh_token: string) {
    try {
      const { email, sub } = this.jwtService.verify(refresh_token, {
        secret: jwtConstants.secret,
      });
      return this.signTokens({ email, sub });
    } catch (e) {
      console.error(e);
      throw new UnauthorizedException();
    }
  }

  protected signTokens(payload: any) {
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: '30d',
      }),
    };
  }

  async register(createUserDto: CreateUserDto) {
    const { email, id } = await this.usersService.create(createUserDto);
    const payload = { email, sub: id };
    return this.signTokens(payload);
  }
}
