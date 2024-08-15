// src/result/result.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result } from './entities/result.entity';
import { Student } from 'src/student/entities/student.entity';
import { Subject } from 'src/subjects/entities/subject.entity';

@Injectable()
export class ResultsService {
  constructor(
    @InjectRepository(Result)
    private resultsRepository: Repository<Result>,
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
    @InjectRepository(Subject)
    private subjectsRepository: Repository<Subject>,
  ) {}

  async create(result: Result): Promise<Result> {
    const termTotal = result.firstHalfTermAssessment + result.firstHalfTermTest + result.secondHalfTermAssessment + result.secondHalfTermTest + result.termExam;
    result.termTotal = termTotal;

    const classResults = await this.resultsRepository.find({
      where: {
        subject: result.subject,
        term: result.term,
        session: result.session,
        year: result.year,
        student: {
          studentClass: result.student.studentClass,
        } as any, // use type assertion if necessary
      },
      relations: ['student'],
    });

    const classTotalScores = classResults.map(r => r.termTotal);
    const classAverage = classTotalScores.reduce((a, b) => a + b, 0) / classTotalScores.length;
    const highestInClass = Math.max(...classTotalScores);
    const lowestInClass = Math.min(...classTotalScores);

    result.classAverage = classAverage;
    result.highestInClass = highestInClass;
    result.lowestInClass = lowestInClass;

    classResults.sort((a, b) => b.termTotal - a.termTotal);
    const positionInClass = classResults.findIndex(r => r.student.id === result.student.id) + 1;
    result.positionInClass = positionInClass;

    result.grade = this.calculateGrade(termTotal);
    result.teacherRemark = this.generateRemark(result.grade);

    return this.resultsRepository.save(result);
  }

  calculateGrade(termTotal: number): string {
    if (termTotal >= 70) return 'A';
    if (termTotal >= 60) return 'B';
    if (termTotal >= 50) return 'C';
    if (termTotal >= 45) return 'D';
    if (termTotal >= 40) return 'E';
    return 'F';
  }

  generateRemark(grade: string): string {
    const remarks: { [key: string]: string } = {
      'A': 'Excellent',
      'B': 'Very Good',
      'C': 'Good',
      'D': 'Fair',
      'E': 'Pass',
      'F': 'Fail'
    };
    return remarks[grade] || '';
  }

  
}
