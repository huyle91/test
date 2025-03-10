import { JwtAuthGuard } from '@/modules/routes/auth/guards/jwt-auth.guard'
import {
  CreatePostDto,
  createPostSchema,
  UpdatePostDto,
  updatePostSchema
} from '@/modules/routes/posts/dtos/post.dto'
import { PostsService } from '@/modules/routes/posts/posts.service'
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { User } from '../../../common/decorators/user.decorator'
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe'

@ApiTags('posts')
@Controller({
  path: 'posts',
  version: '1'
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({
    status: 201,
    description: 'The post has been successfully created.'
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @UsePipes(new ZodValidationPipe(createPostSchema))
  async create(@Body() createPostDto: CreatePostDto, @User('id') userId: string) {
    return this.postsService.create(createPostDto, userId)
  }

  @Get('group/:groupId')
  @ApiOperation({ summary: 'Get all posts in a group' })
  @ApiResponse({ status: 200, description: 'Return all posts in the group.' })
  async findAllInGroup(
    @Param('groupId') groupId: string,
    @User('id') userId: string
  ) {
    return this.postsService.findAll(groupId, userId)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a post by id' })
  @ApiResponse({ status: 200, description: 'Return the post.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  async findOne(@Param('id') id: string, @User('id') userId: string) {
    return this.postsService.findOne(id, userId)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a post' })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully updated.'
  })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  @UsePipes(new ZodValidationPipe(updatePostSchema))
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @User('id') userId: string
  ) {
    return this.postsService.update(id, updatePostDto, userId)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully deleted.'
  })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  async remove(@Param('id') id: string, @User('id') userId: string) {
    return this.postsService.remove(id, userId)
  }

  @Post(':id/like')
  @ApiOperation({ summary: 'Like a post' })
  @ApiResponse({ status: 200, description: 'Post has been liked.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  async likePost(@Param('id') id: string, @User('id') userId: string) {
    return this.postsService.likePost(id, userId)
  }

  @Post(':id/unlike')
  @ApiOperation({ summary: 'Unlike a post' })
  @ApiResponse({ status: 200, description: 'Post has been unliked.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  async unlikePost(@Param('id') id: string, @User('id') userId: string) {
    return this.postsService.unlikePost(id, userId)
  }
}
