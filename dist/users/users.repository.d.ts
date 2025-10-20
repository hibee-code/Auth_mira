import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schema/users.schema';
export declare class UsersRepository {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    create(userData: Partial<User>): Promise<UserDocument>;
    calculateProfileCompletion(userData: Partial<User>): number;
    findByEmail(email: string): Promise<import("mongoose").Document<unknown, {}, UserDocument> & User & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    }>;
    findById(id: string | Types.ObjectId): Promise<import("mongoose").Document<unknown, {}, UserDocument> & User & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    }>;
    markEmailVerified(userId: string): Promise<import("mongoose").Document<unknown, {}, UserDocument> & User & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    }>;
    updatePassword(userId: string, hashedPassword: string): Promise<import("mongoose").Document<unknown, {}, UserDocument> & User & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    }>;
    applyReferral(newUserId: string, referralCode: string): Promise<import("mongoose").Document<unknown, {}, UserDocument> & User & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    }>;
}
