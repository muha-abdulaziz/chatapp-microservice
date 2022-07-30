import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Render,
} from '@nestjs/common';
import {ForgotPasswordDto} from './dto/forgot-password.dto';
import {ResetPasswordDto} from './dto/reset-password.dto';
import {SigninDto} from './dto/signin.dto';

@Controller()
export class AuthController {
  @Get('signin')
  @Render('signin')
  signinPage() {
    return;
  }

  @Post('signin')
  // @Render('check-your-email')
  signin(@Body() signinDto: SigninDto) {
    return signinDto;
  }

  @Get('signup')
  @Render('signup')
  signupPage() {
    return;
  }

  @Post('signup')
  @Render('check-your-email')
  signup() {
    return;
  }

  @Get('reset-password')
  @Render('reset-password')
  resetPasswordPage(@Query('token') token: string) {
    if (!token) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return {token};
  }

  @Post('reset-password')
  @Render('check-your-email')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return resetPasswordDto;
  }

  @Get('forgot-password')
  @Render('forgot-password')
  forgotPasswordPage() {
    return;
  }

  @Post('forgot-password')
  @Render('check-your-email')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return forgotPasswordDto;
  }
}
