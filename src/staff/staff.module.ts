import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from './entities/staff.entity';
import { Student } from '../student/entities/student.entity';
import { StudentController } from 'src/student/student.controller';
import { StudentService } from 'src/student/student.service';
import { UserEntity } from 'src/models/user.model';
import { ClassEntity } from 'src/class/entities/class.entity';
import { Subject } from 'src/subjects/entities/subject.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Staff, Student, UserEntity, ClassEntity, Subject])],
  controllers: [
    StaffController,
    //ScoresController,
    StudentController,
  ],
  providers: [
    StaffService,
    //ScoresService,
    StudentService,
  ],
  exports: [StaffService, TypeOrmModule],
})
export class StaffModule {}
