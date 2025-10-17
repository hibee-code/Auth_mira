import { OtpRepository } from './otp.repository';
import { ConfigService } from '@nestjs/config';
import { Types } from 'mongoose';
export declare class OtpService {
    private repo;
    private config;
    constructor(repo: OtpRepository, config: ConfigService);
    private generateCode;
    createOtp(userId: string | Types.ObjectId, purpose: string): Promise<any>;
    canResend(userId: string | Types.ObjectId, purpose: string): Promise<boolean>;
    verifyOtp(userId: string | Types.ObjectId, code: string, purpose: string): Promise<any>;
}
