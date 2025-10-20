import { Model } from 'mongoose';
import { SignupDto } from './dto/signup.dto';
import { EmailService } from '../mailer/mailer.service';
import { OtpService } from '../otp/otp.service';
import { LoginDto } from './dto/login.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/rest-password.dto';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from 'src/users/model/user.model';
export declare class AuthService {
    private readonly userModel;
    private readonly emailService;
    private readonly otpService;
    private jwtService;
    constructor(userModel: Model<UserDocument>, emailService: EmailService, otpService: OtpService, jwtService: JwtService);
    signup(signupDto: SignupDto): Promise<User>;
    verifyEmail(dto: VerifyOtpDto): Promise<{
        message: string;
    }>;
    resendOtp(dto: ResendOtpDto): Promise<{
        message: string;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
