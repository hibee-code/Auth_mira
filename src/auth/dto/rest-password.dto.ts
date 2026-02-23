import { IsEmail, IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'NewStrongPassword1!' })
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak. Must contain at least 1 uppercase, 1 lowercase, and 1 number or special character',
  })
  newPassword: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  code: string;
}

