import { Repository } from 'typeorm';
import Token from '../models/token.model';
import * as _ from 'lodash';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import IBasicCrud from '../interfaces/crud.interface';

@Injectable()
export default class TokenService implements IBasicCrud<Token> {
  repository: Repository<Token> = this.connection;

  constructor(
    @InjectRepository(Token) private readonly connection: Repository<Token>,
  ) {}

  resolver(partial: Partial<Token>): Token {
    return _.extend(new Token(), partial);
  }

  includes = ['user'];

  public async all(): Promise<Token[]> {
    return await this.repository.find({
      relations: this.includes,
      cache: true,
    });
  }

  public async delete(id: number): Promise<Token | null> {
    const user = this.repository.findOneBy({ id });
    await this.repository.delete(id);
    return user;
  }

  public async find(props: Partial<Token>): Promise<Token | null> {
    return await this.repository.findOne({
      where: props,
      relations: this.includes,
      cache: true,
    });
  }

  async get(id: number): Promise<Token | null> {
    return await this.repository.findOneBy({ id });
  }

  async save(instance: Partial<Token>): Promise<Token> {
    return await this.repository.save(instance);
  }

  public async update(
    id: number,
    partial: Partial<Token>,
  ): Promise<Token | null> {
    await this.repository.update(id, this.resolver(partial));
    return await this.repository.findOneBy({ id });
  }
}
