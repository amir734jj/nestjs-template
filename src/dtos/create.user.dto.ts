import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import LoginUserDto from './login.user.dto';

export default class CreateUserDto extends LoginUserDto {
  @IsString()
  @IsNotEmpty()
  public username: string;

  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}
