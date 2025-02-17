import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ContentModule } from './content/content.module';
import { TutorialModule } from './tutorial/tutorial.module';


@Module({
  imports: [AuthModule, ContentModule, TutorialModule]
})
export class MainModule {}
