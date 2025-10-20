import { Model, Types } from 'mongoose';
import { Otp, OtpDocument } from './schema/otp.schema';
export declare class OtpRepository {
    private otpModel;
    constructor(otpModel: Model<OtpDocument>);
    create(payload: Partial<Otp>): Promise<import("mongoose").Document<unknown, {}, OtpDocument> & Otp & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    }>;
    findLatest(userId: string | Types.ObjectId): Promise<import("mongoose").Document<unknown, {}, OtpDocument> & Otp & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    }>;
    markUsed(otpId: string): Promise<import("mongoose").Document<unknown, {}, OtpDocument> & Otp & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    }>;
    incrementAttempts(otpId: string): Promise<import("mongoose").Document<unknown, {}, OtpDocument> & Otp & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    }>;
}
