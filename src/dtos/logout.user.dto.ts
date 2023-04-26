import { IsString, IsNotEmpty } from 'class-validator';

export default class LogoutUserDto {
  @IsString()
  @IsNotEmpty()
  public token: string;
}
