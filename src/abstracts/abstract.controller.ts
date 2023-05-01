import {
  BadRequestException,
  Body,
  Delete,
  Get, NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse} from '@nestjs/swagger';
import BasicCrud from '../interfaces/crud.interface';

export abstract class AbstractController<T> {
  abstract service: BasicCrud<T>;

  @Get(':id')
  @ApiOkResponse({
    description: 'Successfully returned a matching record',
  })
  @ApiBadRequestResponse({ description: 'Bad request.'})
  async get(@Param('id') id: number): Promise<T> {
    const result = await this.service.get(id);

    if (!result) {
      throw new NotFoundException();
    }

    return result;
  }

  @Get()
  @ApiOkResponse({
    description: 'Successfully returned all matching record',
  })
  async getAll(): Promise<T[]> {
    return await this.service.all();
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Successfully deleted a matching record',
  })
  async delete(@Param('id') id: number): Promise<T> {
    const result = await this.service.delete(id);

    if (!result) {
      throw new BadRequestException(`Delete with id ${id} failed`);
    }

    return result;
  }

  @Post()
  @ApiCreatedResponse({ description: 'Successfully saved a new record' })
  async save(@Body() question: T): Promise<T> {
    const result = await this.service.save(question);

    if (!result) {
      throw new BadRequestException('Save failed');
    }

    return result;
  }

  @Put(':id')
  @ApiOkResponse({
    description: 'Successfully updated matching record',
  })
  async update(@Param('id') id: number, @Body() question: T): Promise<T> {
    const result = await this.service.update(id, question);

    if (!result) {
      throw new BadRequestException(`Update with id ${id} failed`);
    }

    return result;
  }
}
