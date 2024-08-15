import {
  IsString,
  IsInt,
  IsNotEmpty,
  IsDateString,
  IsPhoneNumber,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum Gender {
  Male = 'male',
  Female = 'female',
}

export class CreateStudentDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'First name of the student' })
  firstName: string;

  @IsString()
  @ApiProperty({
    type: String,
    description: 'Middle name of the student',
    required: false,
  })
  middleName?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'Other names of the student' })
  otherNames: string;

  @IsOptional()
  @IsInt()
  @ApiProperty({ type: Number, description: 'Age of the student' })
  age: number;

  @IsNotEmpty()
  @IsEnum(Gender)
  @ApiProperty({ enum: Gender, description: 'Gender of the student' })
  gender: Gender;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'LGA of origin' })
  lgaOfOrigin: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'State of origin' })
  stateOfOrigin: string;

  @IsNotEmpty()
  @IsPhoneNumber('NG')
  @ApiProperty({ type: String, description: "Parent's phone number" })
  parentsNumber: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: "Parent's address" })
  parentsAddress: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    type: String,
    format: 'date',
    description: 'Date of birth (YYYY-MM-DD)',
  })
  dateOfBirth: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'Class of the student' })
  studentClass: string;

  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  medicalReport: string;

  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  birthCertificate: string;

  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  picture: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;
}

export class StudentRegisterDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'Student identifier' })
  studentIdentifier: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'Password' })
  password: string;

 
}

export class StudentLoginDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'Student identifier' })
  studentIdentifier: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'Password' })
  password: string;
}
