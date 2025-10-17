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
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signup(dto: SignupDto): Promise<User>;
    signupStudent(dto: SignupStudentDto): any;
    signupProfessional(dto: SignupProfessionalDto): any;
    signupHybrid(dto: SignupHybridDto): any;
    login(dto: LoginDto): any;
    verifyEmail(dto: VerifyOtpDto): any;
    resend(dto: ResendOtpDto): any;
    forgotPassword(dto: ForgotPasswordDto): any;
    resetPassword(dto: ResetPasswordDto): any;
    profile(req: any): any;
}
