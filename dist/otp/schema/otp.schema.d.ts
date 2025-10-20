import { Document, Types } from 'mongoose';
export declare class Otp {
    code: string;
    userId: Types.ObjectId;
    expiresAt: Date;
    attemptCount: number;
    verified: boolean;
}
export type OtpDocument = Otp & Document;
export declare const OtpSchema: import("mongoose").Schema<Otp, import("mongoose").Model<Otp, any, any, any, Document<unknown, any, Otp> & Otp & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Otp, Document<unknown, {}, import("mongoose").FlatRecord<Otp>> & import("mongoose").FlatRecord<Otp> & {
    _id: Types.ObjectId;
}>;
