import {IsString, Length} from 'class-validator';

export class ResetPasswordDto {
  @Length(8, 25)
  @IsString()
  password: string;

  @Length(8, 25)
  @IsString()
  confirmPassword: string;

  @IsString()
  token: string;
}
