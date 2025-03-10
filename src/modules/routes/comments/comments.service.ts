import {
  CreateCommentDto,
  UpdateCommentDto
} from '@/modules/routes/comments/dtos/comment.dto'
import { CommentRepository } from '@/modules/routes/comments/repo/comment.repository'
import { PostsService } from '@/modules/routes/posts/posts.service'
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly postsService: PostsService
  ) {}

  async create(createCommentDto: CreateCommentDto, userId: string) {
    // Kiểm tra quyền truy cập vào bài đăng
    await this.postsService.findOne(createCommentDto.post, userId)

    const newComment = await this.commentRepository.create({
      ...createCommentDto,
      author: userId
    })

    return newComment
  }

  async findAll(postId: string, userId: string) {
    // Kiểm tra quyền truy cập vào bài đăng
    await this.postsService.findOne(postId, userId)

    return this.commentRepository.findByPostId(postId)
  }

  async findOne(id: string, userId: string) {
    const comment = await this.commentRepository.findById(id)

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`)
    }

    // Kiểm tra quyền truy cập vào bài đăng chứa comment
    await this.postsService.findOne(comment.post, userId)

    return comment
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, userId: string) {
    const comment = await this.commentRepository.findById(id)

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`)
    }

    // Chỉ tác giả mới có thể cập nhật comment
    if (comment.author !== userId) {
      throw new ForbiddenException('Only the author can update this comment')
    }

    return this.commentRepository.update(id, updateCommentDto)
  }

  async remove(id: string, userId: string) {
    const comment = await this.commentRepository.findById(id)

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`)
    }

    // Tác giả của comment có thể xóa comment
    if (comment.author !== userId) {
      // Hoặc tác giả của bài đăng cũng có thể xóa comment
      const post = await this.postsService.findOne(comment.post, userId)
      if (post.author !== userId) {
        throw new ForbiddenException(
          'Only the comment author or post author can delete this comment'
        )
      }
    }

    const result = await this.commentRepository.delete(id)

    if (!result) {
      throw new NotFoundException(`Comment with ID ${id} not found`)
    }

    return { success: true, message: 'Comment successfully deleted' }
  }

  async likeComment(id: string, userId: string) {
    const comment = await this.commentRepository.findById(id)

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`)
    }

    // Kiểm tra quyền truy cập vào bài đăng chứa comment
    await this.postsService.findOne(comment.post, userId)

    return this.commentRepository.addLike(id, userId)
  }

  async unlikeComment(id: string, userId: string) {
    const comment = await this.commentRepository.findById(id)

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`)
    }

    // Kiểm tra quyền truy cập vào bài đăng chứa comment
    await this.postsService.findOne(comment.post, userId)

    return this.commentRepository.removeLike(id, userId)
  }
}
