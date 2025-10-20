// src/auth/auth.service.ts
import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { EmailService } from '../mailer/mailer.service';
import { UserType } from '../common/enum/user-type.enum';
import { OtpService } from '../otp/otp.service';
import { LoginDto } from './dto/login.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/rest-password.dto';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from 'src/users/model/user.model';



@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly emailService: EmailService,
    private readonly otpService: OtpService,
    private jwtService: JwtService,
  ) {}


async signup(signupDto: SignupDto): Promise<User> {
  const { password, userType, studentProfile, professionalProfile, ...rest } = signupDto;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new this.userModel({
    ...rest,
    password: hashedPassword,
    userType,
    studentProfile: userType !== UserType.PROFESSIONAL ? studentProfile : undefined,
    professionalProfile: userType !== UserType.STUDENT ? professionalProfile : undefined,
  });

  const savedUser = await user.save();

  // Generate OTP and send welcome message together
  const otpCode = await this.otpService.createOtp(savedUser.id, savedUser.email);
  await this.emailService.sendWelcomeAndVerificationEmail(savedUser.email, savedUser.firstName, userType, otpCode);

  return savedUser;
}

async verifyEmail(dto: VerifyOtpDto): Promise<{ message: string }> {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) throw new BadRequestException('User not found');

    await this.otpService.verifyOtp(user._id, dto.code);
    user.isVerified = true;
    await user.save();

    return { message: 'Email verified successfully' };
  }

async resendOtp(dto: ResendOtpDto) {
  const user = await this.userModel.findOne({ email: dto.email });
  if (!user) throw new BadRequestException('User not found');

  const otp = await this.otpService.createOtp(user._id, user.email);
  await this.emailService.sendResendOtpEmail(user.email, user.firstName, otp);

  return { message: 'New verification code sent successfully.' };
}
  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    if (!user.isVerified) throw new UnauthorizedException('Please verify your email first');

    const payload = { sub: user._id, email: user.email, userType: user.userType };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) throw new BadRequestException('User not found');

    const otp = await this.otpService.createOtp(user._id, user.email);
    await this.emailService.sendPasswordReset(user.email, otp);
    return { message: 'Password reset code sent' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) throw new BadRequestException('User not found');

    await this.otpService.verifyOtp(user._id, dto.code);
    user.password = await bcrypt.hash(dto.newPassword, 10);
    await user.save();

    return { message: 'Password reset successful' };
  }
}