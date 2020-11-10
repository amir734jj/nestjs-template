import { Repository } from 'typeorm';
import BasicCrud from '../interfaces/crud.interface';

export abstract class AbstractDal<T> implements BasicCrud<T> {
  abstract repository: Repository<T>;

  abstract resolver(partial: Partial<T>): T;

  includes: string[] = [];

  public async all(): Promise<T[]> {
    return this.repository.find({ relations: this.includes, cache: true });
  }

  public async get(id: number): Promise<T> {
    return this.repository.findOne(id);
  }

  public async find(props: Partial<T>): Promise<T> {
    return this.repository.findOne({
      where: props,
      relations: this.includes,
      cache: true,
    });
  }

  public async save(partial: Partial<T>): Promise<T> {
    return this.repository.save(this.resolver(partial));
  }

  public async update(userId: number, partial: Partial<T>): Promise<T> {
    await this.repository.update(userId, this.resolver(partial));
    return this.repository.findOne(userId);
  }

  public async delete(id: number): Promise<T> {
    const user = this.repository.findOne(id);
    await this.repository.delete(id);
    return user;
  }
}
