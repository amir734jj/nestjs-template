import { Repository } from 'typeorm';
import { Token } from '../models/token.model';
import { AbstractDal } from '../abstracts/abstract.dal';
import * as _ from 'lodash';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
class TokenService extends AbstractDal<Token> {
  repository: Repository<Token> = this.connection;

  constructor(@InjectRepository(Token) private connection: Repository<Token>) {
    super();
  }

  resolver(partial: Partial<Token>): Token {
    return _.extend(new Token(), partial);
  }

  includes = ['user'];
}

export default TokenService;
