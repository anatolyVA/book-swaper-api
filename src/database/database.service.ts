import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    this.$connect;
  }

  async onModuleDestroy() {
    this.$disconnect;
  }

  buildWhereClause(field: string, value: string) {
    switch (field) {
      case 'email':
        return { email: value };
      case 'id':
        return { id: value };
    }
  }

  async recordsExists(
    field: string,
    value: string,
    model: any,
  ): Promise<boolean> {
    const rowsCount = await model.count({
      where: this.buildWhereClause(field, value),
    });

    return rowsCount > 0;
  }
}
