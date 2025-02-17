import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ContentModule } from './content/content.module';
import { ModuleController } from './module/module.controller';
import { ModuleService } from './module/module.service';
import { ModuleModule } from './module/module.module';


@Module({
  imports: [AuthModule, ContentModule, ModuleModule],
  controllers: [ModuleController],
  providers: [ModuleService]
})
export class MainModule {}
