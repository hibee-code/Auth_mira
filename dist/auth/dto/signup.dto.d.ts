import { UserType } from '../../common/enum/user-type.enum';
import { StudentProfileDto } from './studentProfile.dto';
import { ProfessionalProfileDto } from './professionalProfile.dto';
export declare class SignupDto {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    userType: UserType;
    studentProfile?: StudentProfileDto;
    professionalProfile?: ProfessionalProfileDto;
    countryCode?: string;
    phoneNumber?: string;
}
