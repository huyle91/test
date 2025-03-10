import { GroupsController } from '@/modules/routes/groups/groups.controller'
import { GroupsService } from '@/modules/routes/groups/groups.service'
import { GroupRepository } from '@/modules/routes/groups/repo/group.repository'
import { Group, GroupSchema } from '@/modules/routes/groups/schemas/group.schema'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }])],
  controllers: [GroupsController],
  providers: [GroupsService, GroupRepository],
  exports: [GroupsService, GroupRepository]
})
export class GroupsModule {}
