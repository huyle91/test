import {
  Comment,
  CommentDocument
} from '@/modules/routes/comments/schemas/comment.schema'
import { BaseRepository } from '@/modules/shared/repositories/base.repository'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
@Injectable()
export class CommentRepository extends BaseRepository<CommentDocument> {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>
  ) {
    super(commentModel)
  }

  async findByPostId(postId: string): Promise<CommentDocument[]> {
    return this.model.find({ post: postId }).exec()
  }

  async findByAuthor(authorId: string): Promise<CommentDocument[]> {
    return this.model.find({ author: authorId }).exec()
  }

  async addLike(commentId: string, userId: string): Promise<CommentDocument | null> {
    return this.model
      .findByIdAndUpdate(commentId, { $addToSet: { likes: userId } }, { new: true })
      .exec()
  }

  async removeLike(
    commentId: string,
    userId: string
  ): Promise<CommentDocument | null> {
    return this.model
      .findByIdAndUpdate(commentId, { $pull: { likes: userId } }, { new: true })
      .exec()
  }
}
