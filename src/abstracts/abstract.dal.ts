import { Repository } from 'typeorm';
import IBasicCrud from '../interfaces/crud.interface';
import IEntity from 'src/interfaces/entity.interface';

export abstract class AbstractDal<T extends IEntity> implements IBasicCrud<T> {
  abstract repository: Repository<T>;

  abstract resolver(partial: Partial<T>): T;

  includes: string[] = [];

  public async all(): Promise<T[]> {
    return await this.repository.find({
      relations: this.includes,
      cache: true,
    });
  }

  public async get(id: number): Promise<T> {
    return await this.repository.findOneBy({ id });
  }

  public async find(props: Partial<T>): Promise<T> {
    return await this.repository.findOne({
      where: props,
      relations: this.includes,
      cache: true,
    });
  }

  public async save(partial: Partial<T>): Promise<T> {
    return await this.repository.save(this.resolver(partial));
  }

  public async update(id: number, partial: Partial<T>): Promise<T> {
    await this.repository.update(id, this.resolver(partial));
    return await this.repository.findOneBy({ id });
  }

  public async delete(id: number): Promise<T> {
    const user = this.repository.findOneBy({ id });
    await this.repository.delete(id);
    return user;
  }
}
