import mongoose from "mongoose";
import { GenderType } from "src/common/enum/gender.enum";
import { PhoneNumber } from "../schema/phoneNumber.schema";
import { Address } from "../schema/address.schema";
import { UserType } from "src/common/enum/user-type.enum";
import { StudentProfile } from "../schema/studentProfile.schema";
import { ProfessionalProfile } from "../schema/professionalProfile.schema";
import { HybridProfile } from "../schema/hybridProfile.schema";
export declare class User {
    _id?: mongoose.Schema.Types.ObjectId;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    get fullName(): string;
    username: string;
    gender: GenderType;
    phone: PhoneNumber;
    address: Address;
    lastLogin: Date;
    role: string;
    userType: UserType;
    studentProfile?: StudentProfile;
    professionalProfile?: ProfessionalProfile;
    hybridProfile?: HybridProfile;
    isVerified: boolean;
    createdBy: mongoose.Schema.Types.ObjectId;
    deletedAt: Date;
    stateId: mongoose.Schema.Types.ObjectId;
    lastModifiedBy: mongoose.Schema.Types.ObjectId;
}
export type UserDocument = User & mongoose.Document;
export declare const userModel: mongoose.Schema<User, mongoose.Model<User, any, any, any, mongoose.Document<unknown, any, User> & User & Required<{
    _id: mongoose.Schema.Types.ObjectId;
}>, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, User, mongoose.Document<unknown, {}, mongoose.FlatRecord<User>> & mongoose.FlatRecord<User> & Required<{
    _id: mongoose.Schema.Types.ObjectId;
}>>;
