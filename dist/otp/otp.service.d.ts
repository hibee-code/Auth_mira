import { Model } from 'mongoose';
import { Otp } from './schema/otp.schema';
export declare class OtpService {
    private readonly otpModel;
    constructor(otpModel: Model<Otp>);
    private generateOtpCode;
    createOtp(userId: any, email: string): Promise<string>;
    verifyOtp(userId: any, code: string): Promise<boolean>;
    resendOtp(userId: any, email: string): Promise<string>;
}
