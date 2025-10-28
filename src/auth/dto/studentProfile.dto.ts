import { IsString, IsNotEmpty } from "class-validator";

export class StudentProfileDto {
  @IsString() 
  @IsNotEmpty() 
  institution: string;

  @IsString() 
  @IsNotEmpty() 
  faculty: string;

  @IsString() 
  @IsNotEmpty() 
  department: string;

  @IsString() 
  @IsNotEmpty() 
  levelType: string;

  @IsString() 
  @IsNotEmpty() 
  level: string;
  
}