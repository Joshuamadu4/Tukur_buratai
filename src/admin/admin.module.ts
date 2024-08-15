import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './admin.service';
import { UserController } from './admin.controller';
import { AuthModule } from '../auth/auth.module';
import { UserEntity } from '../models/user.model';
import { Student } from 'src/student/entities/student.entity';
import { StudentService } from 'src/student/student.service';
import { ClassEntity } from 'src/class/entities/class.entity';
import { Subject } from 'src/subjects/entities/subject.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, Student, ClassEntity, Subject]),
    forwardRef(() => AuthModule),
  ],
  providers: [UserService, StudentService],
  controllers: [UserController],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
