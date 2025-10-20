import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { QueryWithHelpers } from "mongoose";
import { GenderType } from "src/common/enum/gender.enum";
import { PhoneNumber, PhoneNumberSchema } from "../schema/phoneNumber.schema";
import { Address, AddressSchema } from "../schema/address.schema";
import { UserType } from "src/common/enum/user-type.enum";
import { StudentProfile, StudentProfileSchema } from "../schema/studentProfile.schema";
import { ProfessionalProfile, ProfessionalProfileSchema } from "../schema/professionalProfile.schema";
import { HybridProfile, HybridProfileSchema } from "../schema/hybridProfile.schema";

@Schema()
export class User {
   _id?: mongoose.Schema.Types.ObjectId;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ computed: true })
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @Prop()
  username: string;

  @Prop({ enum: Object.values(GenderType) })
  gender: GenderType;

  @Prop({ type: PhoneNumberSchema })
  phone: PhoneNumber;

  @Prop({ type: AddressSchema })
  address: Address;

  @Prop()
  lastLogin: Date;

  @Prop()
  role: string;
    @Prop({ enum: Object.values(UserType)})
  userType: UserType;

  @Prop({ type: StudentProfileSchema })
  studentProfile?: StudentProfile;

  @Prop({ type: ProfessionalProfileSchema })
  professionalProfile?: ProfessionalProfile;

  @Prop({ type: HybridProfileSchema })
  hybridProfile?: HybridProfile;

  @Prop({ default: false })
  isVerified: boolean;


  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Date })
  deletedAt: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'State' })
  stateId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  lastModifiedBy: mongoose.Schema.Types.ObjectId;
}

export type UserDocument = User & mongoose.Document;
export const userModel = SchemaFactory.createForClass(User);



