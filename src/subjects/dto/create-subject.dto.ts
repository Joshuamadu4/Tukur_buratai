import { IsString, IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubjectDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The name of the subject' })
  subjectName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'A brief description of the subject',
  })
  description: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The title of the class this subject belongs to',
  })
  classTitle: string;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({
    description: 'The ID of the category this subject belongs to',
  })
  categoryId: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The name of the person who added the subject',
  })
  addedBy: string;
}
