import { Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { DbService } from 'src/db/db.service';

@Module({
  providers: [ContentService, DbService],
  controllers: [ContentController],
})
export class ContentModule {}
