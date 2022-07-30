import {IsEmail, IsString, MaxLength} from 'class-validator';

export class SigninDto {
  @IsEmail()
  email: string;

  @MaxLength(30)
  @IsString()
  password: string;
}
