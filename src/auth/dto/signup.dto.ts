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
import { StudentProfileDto } from './studentProfile.dto';
import { ProfessionalProfileDto } from './professionalProfile.dto';



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
