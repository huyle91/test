import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema } from 'mongoose'

export type CommentDocument = Comment & Document

@Schema({ collection: 'comments', timestamps: true })
export class Comment {
  @Prop({ required: true })
  content: string

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  author: string

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Post', required: true })
  post: string

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
    default: []
  })
  likes: string[]
}

export const CommentSchema = SchemaFactory.createForClass(Comment)
