import { JwtAuthGuard } from '@/modules/routes/auth/guards/jwt-auth.guard'
import {
  CreateGroupDto,
  createGroupSchema,
  UpdateGroupDto,
  updateGroupSchema
} from '@/modules/routes/groups/dtos/group.dto'
import { GroupsService } from '@/modules/routes/groups/groups.service'
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { User } from '../../../common/decorators/user.decorator'
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe'

@ApiTags('groups')
@Controller({
  path: 'groups',
  version: '1'
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new group' })
  @ApiResponse({
    status: 201,
    description: 'The group has been successfully created.'
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @UsePipes(new ZodValidationPipe(createGroupSchema))
  async create(@Body() createGroupDto: CreateGroupDto, @User('id') userId: string) {
    return this.groupsService.create(createGroupDto, userId)
  }

  @Get()
  @ApiOperation({ summary: 'Get all groups' })
  @ApiResponse({ status: 200, description: 'Return all groups.' })
  async findAll(
    @User('id') userId: string,
    @Query('access') access?: 'all' | 'mine'
  ) {
    return this.groupsService.findAll(userId, access)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a group by id' })
  @ApiResponse({ status: 200, description: 'Return the group.' })
  @ApiResponse({ status: 404, description: 'Group not found.' })
  async findOne(@Param('id') id: string, @User('id') userId: string) {
    return this.groupsService.findOne(id, userId)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a group' })
  @ApiResponse({
    status: 200,
    description: 'The group has been successfully updated.'
  })
  @ApiResponse({ status: 404, description: 'Group not found.' })
  @UsePipes(new ZodValidationPipe(updateGroupSchema))
  async update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
    @User('id') userId: string
  ) {
    return this.groupsService.update(id, updateGroupDto, userId)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a group' })
  @ApiResponse({
    status: 200,
    description: 'The group has been successfully deleted.'
  })
  @ApiResponse({ status: 404, description: 'Group not found.' })
  async remove(@Param('id') id: string, @User('id') userId: string) {
    return this.groupsService.remove(id, userId)
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Add a member to the group' })
  @ApiResponse({
    status: 200,
    description: 'The member has been successfully added.'
  })
  @ApiResponse({ status: 404, description: 'Group not found.' })
  async addMember(
    @Param('id') id: string,
    @Body('userId') memberUserId: string,
    @User('id') userId: string
  ) {
    return this.groupsService.addMember(id, memberUserId, userId)
  }

  @Delete(':id/members/:memberId')
  @ApiOperation({ summary: 'Remove a member from the group' })
  @ApiResponse({
    status: 200,
    description: 'The member has been successfully removed.'
  })
  @ApiResponse({ status: 404, description: 'Group or member not found.' })
  async removeMember(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @User('id') userId: string
  ) {
    return this.groupsService.removeMember(id, memberId, userId)
  }
}
