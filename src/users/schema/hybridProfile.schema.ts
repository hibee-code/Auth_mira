import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProfessionalProfileSchema, ProfessionalProfile } from './professionalProfile.schema';
import { StudentProfileSchema, StudentProfile } from './studentProfile.schema';

@Schema({ _id: false })
export class HybridProfile {
  @Prop({ type: StudentProfileSchema})
  studentProfile: StudentProfile;

  @Prop({ type: ProfessionalProfileSchema})
  professionalProfile: ProfessionalProfile;
}

export const HybridProfileSchema = SchemaFactory.createForClass(HybridProfile);
