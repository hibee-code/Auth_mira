// src/auth/dto/signup.dto.ts
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  IsEnum,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserType } from '../../common/enum/user-type.enum';


class StudentProfileDto {
  @IsString() @IsNotEmpty() institution: string;
  @IsString() @IsNotEmpty() faculty: string;
  @IsString() @IsNotEmpty() department: string;
  @IsString() @IsNotEmpty() levelType: string;
  @IsString() @IsNotEmpty() level: string;
}

class ProfessionalProfileDto {
  @IsString() @IsNotEmpty() title: string;
  @IsString() @IsNotEmpty() fieldOfSpecialization: string;
  @IsString() @IsNotEmpty() organization: string;
  @IsString() @IsNotEmpty() yearsOfExperience: string;
}

export class SignupDto {
  @IsString() @IsNotEmpty() firstName: string;
  @IsString() @IsNotEmpty() lastName: string;
  @IsString() @IsNotEmpty() username: string;

  @IsEmail() email: string;

  @IsString() @MinLength(6) password: string;

  @IsEnum(UserType) userType: UserType;

  @IsOptional() @ValidateNested() @Type(() => StudentProfileDto)
  studentProfile?: StudentProfileDto;

  @IsOptional() @ValidateNested() @Type(() => ProfessionalProfileDto)
  professionalProfile?: ProfessionalProfileDto;

  @IsOptional() @IsString() countryCode?: string;
  @IsOptional() @IsString() phoneNumber?: string;
}
