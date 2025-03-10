import { CommentsController } from '@/modules/routes/comments/comments.controller'
import { CommentsService } from '@/modules/routes/comments/comments.service'
import { CommentRepository } from '@/modules/routes/comments/repo/comment.repository'
import {
  Comment,
  CommentSchema
} from '@/modules/routes/comments/schemas/comment.schema'
import { PostsModule } from '@/modules/routes/posts/posts.module'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    PostsModule // Import PostsModule để sử dụng PostsService
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentRepository],
  exports: [CommentsService, CommentRepository]
})
export class CommentsModule {}
