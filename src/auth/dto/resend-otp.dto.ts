import { IsEmail, IsNotEmpty, IsIn } from 'class-validator';
import { OTP_PURPOSE } from '../../common/constants';

export class ResendOtpDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsIn([OTP_PURPOSE.EMAIL_VERIFICATION, OTP_PURPOSE.PASSWORD_RESET])
  purpose: string;
}
