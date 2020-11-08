import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { LoginUserDto } from './login.user.dto';

export class CreateUserDto extends LoginUserDto {
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
