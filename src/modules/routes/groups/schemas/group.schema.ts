import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema } from 'mongoose'

export type GroupDocument = Group & Document

@Schema({ timestamps: true })
export class Group {
  @Prop({ required: true })
  name: string

  @Prop()
  description: string

  @Prop({ default: false })
  isPrivate: boolean

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  owner: string

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
    default: []
  })
  members: string[]
}

export const GroupSchema = SchemaFactory.createForClass(Group)
