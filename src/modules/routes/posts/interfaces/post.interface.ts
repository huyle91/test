export interface IPost {
  _id?: string
  content: string
  author: string
  group: string
  likes: string[]
  createdAt?: Date
  updatedAt?: Date
}
