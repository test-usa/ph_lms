import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MainModule } from './main/main.module';
import { ContentService } from './main/content/content.service';
import { DbModule } from './db/db.module';


@Module({
  imports: [MainModule, DbModule],
  controllers: [AppController],
  providers: [AppService, ContentService],
})
export class AppModule {}
