import { IsDateString, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStaffDto {
  @ApiProperty({ description: 'Name of the staff member' })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'Email of the staff member' })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ description: 'Password for the staff member', minLength: 6 })
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({
    description: 'Confirm password for the staff member',
    minLength: 6,
  })
  @IsNotEmpty()
  readonly confirmPassword: string;

  @ApiProperty({ description: 'Gender of the staff member' })
  @IsNotEmpty()
  @IsString()
  readonly gender: string;

  @ApiProperty({ description: 'Phone number of the staff member' })
  @IsNotEmpty()
  @IsString()
  readonly phoneNumber: string;

  @ApiProperty({ description: 'Date of birth of the staff member' })
  @IsNotEmpty()
  readonly dateOfBirth: Date;

  @ApiProperty({ description: 'Qualifications of the staff member' })
  @IsNotEmpty()
  @IsString()
  readonly qualifications: string;

 }

 export class LoginStaffDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
