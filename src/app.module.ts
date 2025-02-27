import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MainModule } from './main/main.module';
import { DbModule } from './db/db.module';
import { ContentController } from './main/content/content.controller';
import { ContentService } from './main/content/content.service';
import { ModuleController } from './main/module/module.controller';
import { ModuleService } from './main/module/module.service';
import { QuizController } from './main/quiz/quiz.controller';
import { QuizService } from './main/quiz/quiz.service';
import { LibModule } from './lib/lib.module';
import { UserSeeder } from './seed/admin.seed';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { BlogController } from './main/blog/blog.controller';
import { BlogService } from './main/blog/blog.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AssignmentController } from './main/assignment/assignment.controller';
import { AssignmentService } from './main/assignment/assignment.service';

@Module({
  imports: [
    MainModule,
    DbModule,
    LibModule,
    ConfigModule.forRoot({
      isGlobal: true, // This makes ConfigService available globally
    }),
    JwtModule.register({
      global: true, // This makes ConfigService available globally
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [
    AppController,
    ContentController,
    ModuleController,
    QuizController,
    BlogController,
    AssignmentController
  ],
  providers: [
    AppService,
    ContentService,
    ModuleService,
    QuizService,
    UserSeeder,
    BlogService,
    AssignmentService
  ],
})
export class AppModule {}
