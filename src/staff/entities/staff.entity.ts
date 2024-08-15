import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Subject } from 'src/subjects/entities/subject.entity';
import { UserEntity } from 'src/models/user.model';
import { ClassEntity } from 'src/class/entities/class.entity';

@Entity()
export class Staff extends BaseEntity {
  static password(password: string, password1: any) {
    throw new Error('Method not implemented.');
  }
  static email(arg0: string, email: any, arg2: string) {
    throw new Error('Method not implemented.');
  }
  static id(id: any): any {
    throw new Error('Method not implemented.');
  }
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.teachers, { eager: true })
  @JoinColumn({ name: 'teacherId' })
  user: UserEntity;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  qualifications: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ unique: true })
  email: string;

  @ManyToMany(() => Subject, (subject) => subject.teachers)
  subjects: Subject[];

  @ManyToOne(() => ClassEntity, (classEntity) => classEntity.teachers)
  classroom: ClassEntity;
}
