export interface IGroup {
  _id?: string
  name: string
  description?: string
  isPrivate: boolean
  owner: string
  members: string[]
  createdAt?: Date
  updatedAt?: Date
}
