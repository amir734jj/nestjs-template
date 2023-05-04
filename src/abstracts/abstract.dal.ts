import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import IBasicCrud from '../interfaces/crud.interface';
import IEntity from 'src/interfaces/entity.interface';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

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

  public async count(props: Partial<T>): Promise<number> {
    return await this.repository.count({
      where: props,
    } as FindOneOptions<T>);
  }

  public async get(id: number): Promise<T | null> {
    return await this.repository.findOne({
      where: { id },
      relations: this.includes,
    } as FindOneOptions<T>);
  }

  public async find(props: Partial<T>): Promise<T | null> {
    return await this.repository.findOne({
      where: props,
      relations: this.includes,
    } as FindOneOptions<T>);
  }

  public async findMany(props: Partial<T>): Promise<T[]> {
    return await this.repository.find({
      where: props,
      relations: this.includes,
    } as FindOneOptions<T>);
  }

  public async save(partial: Partial<T>): Promise<T> {
    return await this.repository.save(this.resolver(partial));
  }

  public async update(id: number, partial: Partial<T>): Promise<T | null> {
    await this.repository.update(
      id,
      this.resolver(partial) as QueryDeepPartialEntity<T>,
    );
    return await this.repository.findOneBy({ id } as FindOptionsWhere<T>);
  }

  public async delete(id: number): Promise<T | null> {
    const user = this.repository.findOneBy({ id } as FindOptionsWhere<T>);
    await this.repository.delete(id);
    return user;
  }
}
