import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LibService } from 'src/lib/lib.service';
import { DbService } from 'src/db/db.service';
import { $Enums } from '@prisma/client';

@Injectable()
export class UserSeeder implements OnModuleInit {
  constructor(
    private readonly config: ConfigService,
    private readonly lib: LibService,
    private readonly db: DbService,
  ) {}

  async onModuleInit() {
    await this.seedAdmin();
  }

  async seedAdmin() {
    const adminExists = await this.db.user.findFirst({
      where: {
        role: $Enums.UserRole.ADMIN,
      },
    });

    if (!adminExists) {
      const hashedPassword = await this.lib.hashPassword({
        password: this.config.getOrThrow('ADMIN_PASS') as string,
        round: 6,
      });
      const adminUser = await this.db.user.create({
        data: {
          email: this.config.getOrThrow('ADMIN_EMAIL') as string,
          password: hashedPassword,
          role: $Enums.UserRole.ADMIN,
        },
      });
      Logger.log('Admin user created successfully.');
    } else {
      Logger.log('Admin user already exists.');
    }
  }
}
