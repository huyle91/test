import { Group, GroupDocument } from '@/modules/routes/groups/schemas/group.schema'
import { BaseRepository } from '@/modules/shared/repositories/base.repository'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class GroupRepository extends BaseRepository<GroupDocument> {
  constructor(@InjectModel(Group.name) private groupModel: Model<GroupDocument>) {
    super(groupModel)
  }

  async findByOwnerId(ownerId: string): Promise<GroupDocument[]> {
    return this.model.find({ owner: ownerId }).exec()
  }

  async findUserGroups(userId: string): Promise<GroupDocument[]> {
    return this.model
      .find({
        $or: [{ owner: userId }, { members: userId }]
      })
      .exec()
  }

  async addMember(groupId: string, userId: string): Promise<GroupDocument | null> {
    return this.model
      .findByIdAndUpdate(groupId, { $addToSet: { members: userId } }, { new: true })
      .exec()
  }

  async removeMember(
    groupId: string,
    userId: string
  ): Promise<GroupDocument | null> {
    return this.model
      .findByIdAndUpdate(groupId, { $pull: { members: userId } }, { new: true })
      .exec()
  }

  async isMember(groupId: string, userId: string): Promise<boolean> {
    const group = await this.model
      .findOne({
        _id: groupId,
        $or: [{ owner: userId }, { members: userId }]
      })
      .exec()
    return !!group
  }
}
