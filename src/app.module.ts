import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MainModule } from './main/main.module';
import { DbModule } from './db/db.module';
import { ContentController } from './main/content/content.controller';
import { ContentService } from './main/content/content.service';
import { DbService } from './db/db.service';

@Module({
  imports: [MainModule, DbModule],
  controllers: [AppController, ContentController],
  providers: [AppService, ContentService, DbService],
})
export class AppModule {}
