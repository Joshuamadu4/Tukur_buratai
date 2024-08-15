import { IsDateString, IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStaffDto {
  @ApiProperty({ description: 'Name of the staff member', required: false })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({ description: 'Email of the staff member', required: false })
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @ApiProperty({ description: 'Password for the staff member', minLength: 6, required: false })
  @IsOptional()
  @IsString()
  readonly password?: string;

  @ApiProperty({ description: 'Gender of the staff member', required: false })
  @IsOptional()
  @IsString()
  readonly gender?: string;

  @ApiProperty({ description: 'Phone number of the staff member', required: false })
  @IsOptional()
  @IsString()
  readonly phoneNumber?: string;

  @ApiProperty({ description: 'Date of birth of the staff member', required: false })
  @IsOptional()
  @IsDateString()
  readonly dateOfBirth?: string;

  @ApiProperty({ description: 'Qualifications of the staff member', required: false })
  @IsOptional()
  @IsString()
  readonly qualifications?: string;

}
