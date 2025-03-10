import { User, UserDocument } from '@/modules/routes/users/schemas/user.schema'
import { BaseRepository } from '@/modules/shared/repositories/base.repository'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class UserRepository extends BaseRepository<UserDocument> {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super(userModel)
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.model.findOne({ email }).exec()
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.model.findOne({ username }).exec()
  }
}
