import { Model } from 'mongoose';
import { Otp } from './schema/otp.schema';
export declare class OtpService {
    private readonly otpModel;
    constructor(otpModel: Model<Otp>);
    private generateOtpCode;
    createOtp(userId: string, email: string): Promise<string>;
    verifyOtp(userId: string, code: string): Promise<boolean>;
    resendOtp(userId: string, email: string): Promise<string>;
}
