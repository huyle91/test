import {
  CreateGroupDto,
  UpdateGroupDto
} from '@/modules/routes/groups/dtos/group.dto'
import { GroupRepository } from '@/modules/routes/groups/repo/group.repository'
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class GroupsService {
  constructor(private readonly groupRepository: GroupRepository) {}

  async create(createGroupDto: CreateGroupDto, userId: string) {
    const newGroup = await this.groupRepository.create({
      ...createGroupDto,
      owner: userId,
      members: [userId] // Người tạo nhóm tự động là thành viên
    })

    return newGroup
  }

  async findAll(userId: string, access?: 'all' | 'mine') {
    if (access === 'mine') {
      return this.groupRepository.findUserGroups(userId)
    }

    // Lấy danh sách nhóm công khai và nhóm mà người dùng là thành viên
    const groups = await this.groupRepository.findAll()
    return groups.filter(
      (group) =>
        !group.isPrivate || group.owner === userId || group.members.includes(userId)
    )
  }

  async findOne(id: string, userId: string) {
    const group = await this.groupRepository.findById(id)

    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`)
    }

    // Kiểm tra quyền truy cập vào nhóm riêng tư
    if (
      group.isPrivate &&
      group.owner !== userId &&
      !group.members.includes(userId)
    ) {
      throw new ForbiddenException('You do not have permission to access this group')
    }

    return group
  }

  async update(id: string, updateGroupDto: UpdateGroupDto, userId: string) {
    // Kiểm tra quyền sở hữu
    const group = await this.groupRepository.findById(id)

    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`)
    }

    if (group.owner !== userId) {
      throw new ForbiddenException('Only the group owner can update group details')
    }

    return this.groupRepository.update(id, updateGroupDto)
  }

  async remove(id: string, userId: string) {
    const group = await this.groupRepository.findById(id)

    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`)
    }

    if (group.owner !== userId) {
      throw new ForbiddenException('Only the group owner can delete the group')
    }

    const result = await this.groupRepository.delete(id)

    if (!result) {
      throw new NotFoundException(`Group with ID ${id} not found`)
    }

    return { success: true, message: 'Group successfully deleted' }
  }

  async addMember(groupId: string, memberUserId: string, userId: string) {
    const group = await this.groupRepository.findById(groupId)

    if (!group) {
      throw new NotFoundException(`Group with ID ${groupId} not found`)
    }

    // Chỉ chủ sở hữu có thể thêm thành viên vào nhóm riêng tư
    if (group.isPrivate && group.owner !== userId) {
      throw new ForbiddenException(
        'Only the group owner can add members to a private group'
      )
    }

    const updatedGroup = await this.groupRepository.addMember(groupId, memberUserId)
    return updatedGroup
  }

  async removeMember(groupId: string, memberId: string, userId: string) {
    const group = await this.groupRepository.findById(groupId)

    if (!group) {
      throw new NotFoundException(`Group with ID ${groupId} not found`)
    }

    // Kiểm tra quyền xóa thành viên
    // Chỉ chủ sở hữu nhóm hoặc thành viên tự rời nhóm
    if (group.owner !== userId && userId !== memberId) {
      throw new ForbiddenException(
        'You do not have permission to remove this member'
      )
    }

    // Không thể xóa chủ sở hữu khỏi nhóm
    if (memberId === group.owner) {
      throw new ForbiddenException('Cannot remove the owner from the group')
    }

    const updatedGroup = await this.groupRepository.removeMember(groupId, memberId)
    return updatedGroup
  }

  async isMember(groupId: string, userId: string): Promise<boolean> {
    return this.groupRepository.isMember(groupId, userId)
  }
}
