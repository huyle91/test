export interface IComment {
  _id?: string
  content: string
  author: string
  post: string
  likes: string[]
  createdAt?: Date
  updatedAt?: Date
}
