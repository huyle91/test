import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema } from 'mongoose'

export type PostDocument = Post & Document

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  content: string

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  author: string

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Group', required: true })
  group: string

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
    default: []
  })
  likes: string[]
}

export const PostSchema = SchemaFactory.createForClass(Post)
