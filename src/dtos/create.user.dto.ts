import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import LoginUserDto from './login.user.dto';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateUserDto extends LoginUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public username: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public password: string;
}
