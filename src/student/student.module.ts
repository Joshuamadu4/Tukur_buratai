import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { UserEntity } from 'src/models/user.model';
import { ClassEntity } from 'src/class/entities/class.entity';
import { Subject } from 'src/subjects/entities/subject.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student, UserEntity, ClassEntity, Subject])],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService, TypeOrmModule],
})
export class StudentModule {}
