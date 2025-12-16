import { Model, Types } from 'mongoose';
import { SignupDto } from './dto/signup.dto';
import { EmailService } from '../mailer/mailer.service';
import { OtpService } from '../otp/otp.service';
import { LoginDto } from './dto/login.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/rest-password.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from 'src/users/model/user.model';
export declare class AuthService {
    private readonly userModel;
    private readonly emailService;
    private readonly otpService;
    private jwtService;
    private configService;
    constructor(userModel: Model<UserDocument>, emailService: EmailService, otpService: OtpService, jwtService: JwtService, configService: ConfigService);
    signup(signupDto: SignupDto): Promise<{
        message: string;
        user: Partial<User>;
    }>;
    private validateProfiles;
    verifyOtp(dto: VerifyOtpDto): Promise<{
        message: string;
    }>;
    resendOtp(dto: ResendOtpDto): Promise<{
        message: string;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string): Promise<void>;
    refreshTokens(userId: string, rt: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    updateRtHash(userId: Types.ObjectId, rt: string): Promise<void>;
    getTokens(userId: any, email: string, userType: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    validateSocialLogin(profile: any): Promise<any>;
}
