import { GroupsService } from '@/modules/routes/groups/groups.service'
import { CreatePostDto, UpdatePostDto } from '@/modules/routes/posts/dtos/post.dto'
import { PostRepository } from '@/modules/routes/posts/repo/post.repository'
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class PostsService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly groupsService: GroupsService
  ) {}

  async create(createPostDto: CreatePostDto, userId: string) {
    // Kiểm tra xem người dùng có phải là thành viên của nhóm không
    const isMember = await this.groupsService.isMember(createPostDto.group, userId)

    if (!isMember) {
      throw new ForbiddenException(
        'You must be a member of the group to create a post'
      )
    }

    const newPost = await this.postRepository.create({
      ...createPostDto,
      author: userId
    })

    return newPost
  }

  async findAll(groupId: string, userId: string) {
    // Kiểm tra quyền truy cập vào nhóm
    await this.groupsService.findOne(groupId, userId)

    return this.postRepository.findByGroupId(groupId)
  }

  async findOne(id: string, userId: string) {
    const post = await this.postRepository.findById(id)

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`)
    }

    // Kiểm tra quyền truy cập vào bài đăng trong nhóm
    await this.groupsService.findOne(post.group, userId)

    return post
  }

  async update(id: string, updatePostDto: UpdatePostDto, userId: string) {
    const post = await this.postRepository.findById(id)

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`)
    }

    // Chỉ tác giả mới có thể cập nhật bài đăng
    if (post.author !== userId) {
      throw new ForbiddenException('Only the author can update this post')
    }

    return this.postRepository.update(id, updatePostDto)
  }

  async remove(id: string, userId: string) {
    const post = await this.postRepository.findById(id)

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`)
    }

    // Chỉ tác giả hoặc chủ sở hữu nhóm mới có thể xóa bài đăng
    if (post.author !== userId) {
      const group = await this.groupsService.findOne(post.group, userId)
      if (group.owner !== userId) {
        throw new ForbiddenException(
          'Only the author or group owner can delete this post'
        )
      }
    }

    const result = await this.postRepository.delete(id)

    if (!result) {
      throw new NotFoundException(`Post with ID ${id} not found`)
    }

    return { success: true, message: 'Post successfully deleted' }
  }

  async likePost(id: string, userId: string) {
    const post = await this.postRepository.findById(id)

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`)
    }

    // Kiểm tra quyền truy cập vào bài đăng trong nhóm
    await this.groupsService.findOne(post.group, userId)

    return this.postRepository.addLike(id, userId)
  }

  async unlikePost(id: string, userId: string) {
    const post = await this.postRepository.findById(id)

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`)
    }

    // Kiểm tra quyền truy cập vào bài đăng trong nhóm
    await this.groupsService.findOne(post.group, userId)

    return this.postRepository.removeLike(id, userId)
  }
}
