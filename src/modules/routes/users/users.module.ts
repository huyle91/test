import { UserRepository } from '@/modules/routes/users/repo/user.repository'
import { UsersController } from '@/modules/routes/users/users.controller'
import { UsersService } from '@/modules/routes/users/users.service'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from './schemas/user.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService]
})
export class UsersModule {}
