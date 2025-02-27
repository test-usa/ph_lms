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
  ) { }

  async onModuleInit() {
    await this.seedAdmin();
  }

  async seedAdmin() {
    const adminExists = await this.db.user.findFirst({
      where: {
        role: $Enums.UserRole.SUPER_ADMIN,
      },
    });

    if (!adminExists) {
      const hashedPassword = await this.lib.hashPassword({
        password: this.config.getOrThrow('ADMIN_PASS') as string,
        round: 6,
      });
      await this.db.user.create({
        data: {
          email: this.config.getOrThrow('ADMIN_EMAIL') as string,
          name: "Super Admin",
          password: hashedPassword,
          role: $Enums.UserRole.SUPER_ADMIN,
        },
      });
      Logger.log('Super Admin user created successfully.');
    } else {
      Logger.log('Super Admin user already exists.');
    }
  }
}
