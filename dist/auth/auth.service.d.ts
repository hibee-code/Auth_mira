import { Model } from 'mongoose';
import { SignupDto } from './dto/signup.dto';
import { User, UserDocument } from '../users/model/user.model';
import { EmailService } from '../mailer/mailer.service';
import { OtpService } from '../otp/otp.service';
export declare class AuthService {
    private readonly userModel;
    private readonly emailService;
    private readonly otpService;
    constructor(userModel: Model<UserDocument>, emailService: EmailService, otpService: OtpService);
    signup(signupDto: SignupDto): Promise<User>;
}
