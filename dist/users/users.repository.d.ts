import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
export declare class UsersRepository {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    create(userData: Partial<User>): Promise<UserDocument>;
    calculateProfileCompletion(userData: Partial<User>): number;
    findByEmail(email: string): Promise<any>;
    findById(id: string | Types.ObjectId): Promise<any>;
    markEmailVerified(userId: string): Promise<any>;
    updatePassword(userId: string, hashedPassword: string): Promise<any>;
    applyReferral(newUserId: string, referralCode: string): Promise<any>;
}
