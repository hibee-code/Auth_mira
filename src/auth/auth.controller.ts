import { Body, Controller, Post, UseGuards, HttpCode, HttpStatus, Get, Req, Res, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetCurrentUser } from '../common/decorators/get-current-user.decorator';
import { RtGuard } from './jwt/rt.guard';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { ResetPasswordDto } from './dto/rest-password.dto';
import { SignupDto } from './dto/signup.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { Public } from 'src/common/decorators/public.decorator';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('signup')
  signup(@Body() signUp: SignupDto) {
    return this.authService.signup(signUp);
  }

  @Public()
  @Post('verify')
  verify(@Body() otp: VerifyOtpDto) {
    return this.authService.verifyOtp(otp);
  }

  @Public()
  @Post('resend-otp')
  resendOtp(@Body() dto: ResendOtpDto) {
    return this.authService.resendOtp(dto);
  }

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUser('userId') userId: string) {
    return this.authService.logout(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @UseInterceptors(CacheInterceptor)
  @CacheKey('user_profile')
  @CacheTTL(300) // 5 minutes
  getProfile(@GetCurrentUser() user: any) {
    return user;
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUser('userId') userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Public()
  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Public()
  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
  @Public()
  @UseGuards(AuthGuard('google'))
  @Get('google')
  googleLogin() {
    // initiates the Google OAuth2 flow
  }

  @Public()
  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  async googleLoginCallback(@Req() req, @Res() res) {
    const user = await this.authService.validateSocialLogin(req.user);
    const tokens = await this.authService.getTokens(user._id, user.email, user.userType);
    await this.authService.updateRtHash(user._id, tokens.refreshToken);
    // Redirect to frontend with tokens
    // In a real app, you might redirect to a client page with tokens in query params or set cookies.
    // For now, returning JSON for clarity, or redirecting to a dummy frontend URL.
    // res.redirect(\`http://localhost:3000/auth/callback?accessToken=\${tokens.accessToken}&refreshToken=\${tokens.refreshToken}\`);
    res.json(tokens);
  }

  @Public()
  @UseGuards(AuthGuard('linkedin'))
  @Get('linkedin')
  linkedinLogin() {
    // initiates the LinkedIn OAuth2 flow
  }

  @Public()
  @UseGuards(AuthGuard('linkedin'))
  @Get('linkedin/callback')
  async linkedinLoginCallback(@Req() req, @Res() res) {
    const user = await this.authService.validateSocialLogin(req.user);
    const tokens = await this.authService.getTokens(user._id, user.email, user.userType);
    await this.authService.updateRtHash(user._id, tokens.refreshToken);
    res.json(tokens);
  }

  @Public()
  @UseGuards(AuthGuard('microsoft'))
  @Get('microsoft')
  microsoftLogin() {
    // initiates the Microsoft OAuth2 flow
  }

  @Public()
  @UseGuards(AuthGuard('microsoft'))
  @Get('microsoft/callback')
  async microsoftLoginCallback(@Req() req, @Res() res) {
    const user = await this.authService.validateSocialLogin(req.user);
    const tokens = await this.authService.getTokens(user._id, user.email, user.userType);
    await this.authService.updateRtHash(user._id, tokens.refreshToken);
    res.json(tokens);
  }

  @Public()
  @UseGuards(AuthGuard('apple'))
  @Get('apple')
  appleLogin() {
    // initiates the Apple OAuth2 flow
  }

  @Public()
  @UseGuards(AuthGuard('apple'))
  @Post('apple/callback') // Apple sends POST for callback sometimes
  async appleLoginCallback(@Req() req, @Res() res) {
    const user = await this.authService.validateSocialLogin(req.user);
    const tokens = await this.authService.getTokens(user._id, user.email, user.userType);
    await this.authService.updateRtHash(user._id, tokens.refreshToken);
    res.json(tokens);
  }
}
