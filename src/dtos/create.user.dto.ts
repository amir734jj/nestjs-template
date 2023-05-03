import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import LoginUserDto from './login.user.dto';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateUserDto extends LoginUserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public name: string;
}
