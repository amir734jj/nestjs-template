import { Body, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import BasiCrud from '../interfaces/crud.interface';

export abstract class AbstractController<T> {
  abstract service: BasiCrud<T>;

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Successfully returned a matching record',
  })
  async get(@Param('id') id: number): Promise<T> {
    return await this.service.get(id);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Successfully returned all matching record',
  })
  async getAll(): Promise<T[]> {
    return await this.service.all();
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted a matching record',
  })
  async delete(@Param('id') id: number): Promise<T> {
    return this.service.delete(id);
  }

  @Post()
  @ApiResponse({ status: 200, description: 'Successfully saved a new record' })
  async save(@Body() question: T): Promise<T> {
    return this.service.save(question);
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'Successfully updated matching record',
  })
  async update(@Param('id') id: number, @Body() question: T): Promise<T> {
    return this.service.update(id, question);
  }
}
