import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResultsService } from './result.service';
import { Result } from './entities/result.entity';
import { Student } from 'src/student/entities/student.entity';
import { Subject } from 'src/subjects/entities/subject.entity';
import { ResultController } from './result.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Result, Student, Subject])],
  providers: [ResultsService],
  controllers: [ResultController],
})
export class ResultModule {}