import { IsString, IsNotEmpty, IsEnum } from "class-validator";
import { ProfessionalTitle } from "src/common/enum/title.enum";

export class ProfessionalProfileDto {
  @IsEnum(ProfessionalTitle)  // ← Add this instead of @IsString()
  @IsNotEmpty() 
  title: ProfessionalTitle;  // ← Change type to ProfessionalTitle

  @IsString() 
  @IsNotEmpty() 
  fieldOfSpecialization: string;

  @IsString() 
  @IsNotEmpty() 
  organization: string;

  @IsString()  // or @IsNumber() depending on your needs
  @IsNotEmpty() 
  yearsOfExperience: string;
}