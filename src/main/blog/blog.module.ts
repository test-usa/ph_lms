import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { DbService } from 'src/db/db.service';

@Module({
  controllers: [BlogController],
  providers: [BlogService, DbService],
})
export class BlogModule {}
