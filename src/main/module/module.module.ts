import { Module } from '@nestjs/common';
import { ModuleService } from './module.service';
import { ModuleController } from './module.controller';
import { DbService } from 'src/db/db.service';


@Module({
  controllers: [ModuleController],
  providers: [ModuleService, DbService],
})
export class ModuleModule {}
