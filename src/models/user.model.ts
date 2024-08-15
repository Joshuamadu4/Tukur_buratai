import { ClassEntity } from 'src/class/entities/class.entity';
import { Staff } from 'src/staff/entities/staff.entity';
import { Student } from 'src/student/entities/student.entity';

import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum Role {
  Admin = 'admin',
  Student = 'student',
  Teacher = 'teacher',
}

export enum SchoolLevel {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
}

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ nullable: false })
  hashedPassword: string;

  @Column({ type: 'enum', enum: Role, default: Role.Student })
  role: Role;

  @Column({ nullable: true })
  confirmationToken: string;

  @Column({ unique: true, nullable: true })
  studentId: number;

  // @OneToMany(() => Student, (student) => student.user)
  // students: Student[];

  @OneToMany(() => Staff, (teacher) => teacher.user)
  teachers: Staff[];

  @ManyToOne(() => ClassEntity, (classRoom) => classRoom.students)
  class: ClassEntity;
}
