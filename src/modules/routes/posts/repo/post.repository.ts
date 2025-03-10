import { PostDocument } from '@/modules/routes/posts/schemas/post.schema'
import { BaseRepository } from '@/modules/shared/repositories/base.repository'
import { Injectable, Post } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class PostRepository extends BaseRepository<PostDocument> {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {
    super(postModel)
  }

  async findByGroupId(groupId: string): Promise<PostDocument[]> {
    return this.model.find({ group: groupId }).exec()
  }

  async findByAuthor(authorId: string): Promise<PostDocument[]> {
    return this.model.find({ author: authorId }).exec()
  }

  async addLike(postId: string, userId: string): Promise<PostDocument | null> {
    return this.model
      .findByIdAndUpdate(postId, { $addToSet: { likes: userId } }, { new: true })
      .exec()
  }

  async removeLike(postId: string, userId: string): Promise<PostDocument | null> {
    return this.model
      .findByIdAndUpdate(postId, { $pull: { likes: userId } }, { new: true })
      .exec()
  }
}
