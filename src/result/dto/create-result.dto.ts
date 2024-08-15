import { IsNumber, IsString } from "class-validator";

export class CreateResultDto {
    @IsNumber()
    studentId: number;
  
    @IsNumber()
    subjectId: number;
  
    @IsString()
    term: string;
  
    @IsString()
    session: string;
  
    @IsNumber()
    year: number;
  
    @IsString()
    nextTermBegins: string;
  
    @IsNumber()
    firstHalfTermAssessment: number;
  
    @IsNumber()
    firstHalfTermTest: number;
  
    @IsNumber()
    secondHalfTermAssessment: number;
  
    @IsNumber()
    secondHalfTermTest: number;
  
    @IsNumber()
    termExam: number;
  }
  