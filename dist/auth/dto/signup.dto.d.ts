import { UserType } from '../../common/enum/user-type.enum';
declare class StudentProfileDto {
    institution: string;
    faculty: string;
    department: string;
    levelType: string;
    level: string;
}
declare class ProfessionalProfileDto {
    title: string;
    fieldOfSpecialization: string;
    organization: string;
    yearsOfExperience: string;
}
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
export {};
