import { User } from '@/common/decorators/user.decorator'
import { JwtAuthGuard } from '@/modules/routes/auth/guards/jwt-auth.guard'
import { CommentsService } from '@/modules/routes/comments/comments.service'
import {
  CreateCommentDto,
  createCommentSchema,
  UpdateCommentDto,
  updateCommentSchema
} from '@/modules/routes/comments/dtos/comment.dto'
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
import { ZodValidationPipe } from 'nestjs-zod'

@ApiTags('comments')
@Controller({
  path: 'comments',
  version: '1'
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({
    status: 201,
    description: 'The comment has been successfully created.'
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @UsePipes(new ZodValidationPipe(createCommentSchema))
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @User('id') userId: string
  ) {
    return this.commentsService.create(createCommentDto, userId)
  }

  @Get('post/:postId')
  @ApiOperation({ summary: 'Get all comments for a post' })
  @ApiResponse({ status: 200, description: 'Return all comments for the post.' })
  async findAllForPost(@Param('postId') postId: string, @User('id') userId: string) {
    return this.commentsService.findAll(postId, userId)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a comment by id' })
  @ApiResponse({ status: 200, description: 'Return the comment.' })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  async findOne(@Param('id') id: string, @User('id') userId: string) {
    return this.commentsService.findOne(id, userId)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a comment' })
  @ApiResponse({
    status: 200,
    description: 'The comment has been successfully updated.'
  })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  @UsePipes(new ZodValidationPipe(updateCommentSchema))
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @User('id') userId: string
  ) {
    return this.commentsService.update(id, updateCommentDto, userId)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({
    status: 200,
    description: 'The comment has been successfully deleted.'
  })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  async remove(@Param('id') id: string, @User('id') userId: string) {
    return this.commentsService.remove(id, userId)
  }

  @Post(':id/like')
  @ApiOperation({ summary: 'Like a comment' })
  @ApiResponse({ status: 200, description: 'Comment has been liked.' })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  async likeComment(@Param('id') id: string, @User('id') userId: string) {
    return this.commentsService.likeComment(id, userId)
  }

  @Post(':id/unlike')
  @ApiOperation({ summary: 'Unlike a comment' })
  @ApiResponse({ status: 200, description: 'Comment has been unliked.' })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  async unlikeComment(@Param('id') id: string, @User('id') userId: string) {
    return this.commentsService.unlikeComment(id, userId)
  }
}
