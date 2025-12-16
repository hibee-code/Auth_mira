import { Model, Types } from 'mongoose';
import { Otp } from './schema/otp.schema';
export declare class OtpService {
    private readonly otpModel;
    constructor(otpModel: Model<Otp>);
    private generateOtpCode;
    createOtp(userId: Types.ObjectId, email: string): Promise<string>;
    verifyOtp(userId: Types.ObjectId, code: string): Promise<boolean>;
    resendOtp(userId: Types.ObjectId, email: string): Promise<string>;
}
