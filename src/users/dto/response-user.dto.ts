import { $Enums, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class ResponseUserDto implements User {
  id: string;
  role: $Enums.Role;
  email: string;

  @Exclude()
  password: string;

  createdAt: Date;
  updatedAt: Date;
}
