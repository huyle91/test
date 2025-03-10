import { Document, FilterQuery, Model, UpdateQuery } from 'mongoose'

export interface IBaseRepository<T extends Document> {
  findAll(filter?: FilterQuery<T>): Promise<T[]>
  findOne(filter: FilterQuery<T>): Promise<T | null>
  findById(id: string): Promise<T | null>
  create(data: Partial<T>): Promise<T>
  update(id: string, data: UpdateQuery<T>): Promise<T | null>
  delete(id: string): Promise<boolean>
  updateMany(filter: FilterQuery<T>, data: UpdateQuery<T>): Promise<boolean>
  deleteMany(filter: FilterQuery<T>): Promise<boolean>
  count(filter?: FilterQuery<T>): Promise<number>
}

export class BaseRepository<T extends Document> implements IBaseRepository<T> {
  constructor(protected readonly model: Model<T>) {}

  async findAll(filter: FilterQuery<T> = {}): Promise<T[]> {
    return this.model.find(filter).exec()
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter).exec()
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec()
  }

  async create(data: Partial<T>): Promise<T> {
    const entity = new this.model(data)
    return entity.save()
  }

  async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec()
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.deleteOne({ _id: id } as FilterQuery<T>).exec()
    return result.deletedCount > 0
  }

  async updateMany(filter: FilterQuery<T>, data: UpdateQuery<T>): Promise<boolean> {
    const result = await this.model.updateMany(filter, data).exec()
    return result.modifiedCount > 0
  }

  async deleteMany(filter: FilterQuery<T>): Promise<boolean> {
    const result = await this.model.deleteMany(filter).exec()
    return result.deletedCount > 0
  }

  async count(filter: FilterQuery<T> = {}): Promise<number> {
    return this.model.countDocuments(filter).exec()
  }
}
