import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class LogoutUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public token: string;
}
