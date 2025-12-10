import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  IsEnum,
  MinLength,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserType } from '../../common/enum/user-type.enum';
import { StudentProfileDto } from './studentProfile.dto';
import { ProfessionalProfileDto } from './professionalProfile.dto';



export class SignupDto {

  @IsString() @IsNotEmpty() firstName: string;
  @IsString() @IsNotEmpty() lastName: string;
  @IsString() @IsNotEmpty() username: string;

  @IsEmail() email: string;

  @IsString()
  @MinLength(8)
  // Enforce: At least one digit OR special char, At least one uppercase, At least one lowercase.
  // Note: The regex provided in the implementation plan was:
  // /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Password too weak. Must contain at least 1 uppercase, 1 lowercase, and 1 number or special character' })
  password: string;

  @IsEnum(UserType) userType: UserType;

  @IsOptional() @ValidateNested() @Type(() => StudentProfileDto)
  studentProfile?: StudentProfileDto;

  @IsOptional() @ValidateNested() @Type(() => ProfessionalProfileDto)
  professionalProfile?: ProfessionalProfileDto;

  @IsOptional() @IsString() countryCode?: string;
  @IsOptional() @IsString() phoneNumber?: string;
}
