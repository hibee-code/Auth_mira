import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { SignupStudentDto } from './dto/signup-student.dto';
import { SignupProfessionalDto } from './dto/signup-professional.dto';
import { SignupHybridDto } from './dto/signup-hybrid.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('signup/student')
  signupStudent(@Body() dto: SignupStudentDto) {
    return this.authService.signupStudent(dto);
  }

  @Post('signup/professional')
  signupProfessional(@Body() dto: SignupProfessionalDto) {
    return this.authService.signupProfessional(dto);
  }

  @Post('signup/hybrid')
  signupHybrid(@Body() dto: SignupHybridDto) {
    return this.authService.signupHybrid(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('verify-email')
  verifyEmail(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyEmail(dto);
  }

  @Post('resend-otp')
  resend(@Body() dto: ResendOtpDto) {
    return this.authService.resendOtp(dto);
  }

  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Request() req: any) {
    return this.authService.getProfile(req.user.userId);
  }
}
