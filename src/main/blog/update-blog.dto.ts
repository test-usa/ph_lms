import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBlogDto } from './create-blog.dto';

export class UpdateBlogDto extends PartialType(CreateBlogDto) {
  
  @ApiProperty({
    description: 'The unique identifier for the blog to be updated',
    example: 'blog-uuid',
  })
  id: string;
}
