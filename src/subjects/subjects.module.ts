import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import { Subject } from './entities/subject.entity';
import { ClassEntity } from 'src/class/entities/class.entity';
import { Result } from 'src/result/entities/result.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subject, ClassEntity, Result])],
  controllers: [SubjectsController],
  providers: [SubjectService],
  exports: [TypeOrmModule],
})
export class SubjectsModule {}
