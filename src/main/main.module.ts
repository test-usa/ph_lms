import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ContentModule } from './content/content.module';
<<<<<<< HEAD
import { ModuleController } from './module/module.controller';
import { ModuleService } from './module/module.service';
import { ModuleModule } from './module/module.module';
import { DbService } from 'src/db/db.service';

@Module({
  imports: [AuthModule, ContentModule, ModuleModule],
  controllers: [ModuleController],
  providers: [ModuleService, DbService],
=======

@Module({
  imports: [AuthModule, ContentModule],
>>>>>>> 831a5ea848c9347351b8c30df298d2b3ac9220bd
})
export class MainModule {}
