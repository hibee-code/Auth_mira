// src/auth/auth.service.ts
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { User, UserDocument } from '../users/model/user.model';
import { EmailService } from '../mailer/mailer.service';
import { UserType } from '../common/enum/user-type.enum';
import { OtpService } from '../otp/otp.service';


@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly emailService: EmailService,
    private readonly otpService: OtpService,
  ) {}

//   async signup(signupDto: SignupDto): Promise<User> {
//     const {
//       password,
//       userType,
//       studentProfile,
//       professionalProfile,
//       email,
//       firstName,
//       ...rest
//     } = signupDto;

//     // ✅ Check for existing user
//     const existingUser = await this.userModel.findOne({ email });
//     if (existingUser) throw new ConflictException('Email already exists');

//     // ✅ Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const verificationCode = this.generateVerificationCode();

//     const user = new this.userModel({
//       ...rest,
//       email,
//       firstName,
//       password: hashedPassword,
//       userType,
//       isVerified: false,
//       verificationCode,
//       studentProfile: userType !== UserType.PROFESSIONAL ? studentProfile : undefined,
//       professionalProfile: userType !== UserType.STUDENT ? professionalProfile : undefined,
//     });

//     const savedUser = await user.save();

//     // ✅ Send Welcome + Verification Email together
//     await this.emailService.sendWelcomeAndVerificationEmail(
//       email,
//       firstName,
//       userType,
//       verificationCode,
//     );

//     return savedUser;
//   }

//   private generateVerificationCode(): string {
//     return Math.floor(100000 + Math.random() * 900000).toString();
//   }
// }


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
}