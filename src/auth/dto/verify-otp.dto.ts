import { IsEmail, IsString } from 'class-validator';


export class VerifyOtpDto { 

  @IsEmail() e
  email: string; 
  
  @IsString() 
  otp: string; 

}
