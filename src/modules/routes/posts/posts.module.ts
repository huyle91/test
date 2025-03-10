import { PostsController } from '@/modules/routes/posts/posts.controller'
import { PostsService } from '@/modules/routes/posts/posts.service'
import { PostRepository } from '@/modules/routes/posts/repo/post.repository'
import { PostSchema } from '@/modules/routes/posts/schemas/post.schema'
import { Module, Post } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { GroupsModule } from '../groups/groups.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    GroupsModule // Import GroupsModule để sử dụng GroupsService
  ],
  controllers: [PostsController],
  providers: [PostsService, PostRepository],
  exports: [PostsService, PostRepository]
})
export class PostsModule {}
