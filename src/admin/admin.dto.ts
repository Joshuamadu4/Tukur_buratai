import { Request } from 'express';
import { Role } from '../models/user.model';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserRegister {
     
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    username: string;
  

    @ApiProperty()
    @IsNotEmpty()
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    confirmPassword: string;

    @ApiProperty({ enum: ['admin', 'student', 'teacher'] })
    role: Role;
  }
  
  export class UserDto {
    @ApiProperty()
    @IsNotEmpty()
    username: string;
  
    @ApiProperty()
    @IsNotEmpty()
    password: string;

        
    @ApiProperty({ enum: ['admin', 'student', 'teacher'] })
    role: Role;
  }
  
  export class UserLoginDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    username: string;

    
    @ApiProperty()
    @IsNotEmpty()
    password: string;

    @ApiProperty()
    role: Role;
  }
  
  export class UserWithID {
    @ApiProperty()
    id: number;
  
    @ApiProperty()
    username: string;
  
    @ApiProperty({ enum: ['admin', 'student', 'teacher'] })
    role: Role;
}

export class StudentLoginDto {
  @IsString()
  @IsNotEmpty()
  studentIdentifier: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

  
  export interface RequestWithUser extends Request {
    user: UserWithID;
  }