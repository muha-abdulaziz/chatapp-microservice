import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Redirect,
  Render,
} from '@nestjs/common';
import {AuthService} from './auth.service';
import {ForgotPasswordDto} from './dto/forgot-password.dto';
import {ResetPasswordDto} from './dto/reset-password.dto';
import {SigninDto} from './dto/signin.dto';
import {SignupDto} from './dto/signup.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

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
  async signup(@Body() signupDto: SignupDto) {
    await this.authService.setToken(signupDto);
    return;
  }

  @Get('reset-password')
  @Render('reset-password')
  resetPasswordPage(@Query('token') token: string) {
    if (!token) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return {token};
  }

  @Post('reset-password')
  @Redirect('signin')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto);
    return;
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
