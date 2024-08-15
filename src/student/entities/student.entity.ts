import { ClassEntity } from 'src/class/entities/class.entity';
import { UserEntity } from 'src/models/user.model';
import { Result } from 'src/result/entities/result.entity';
import { Subject } from 'src/subjects/entities/subject.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column({ unique: true })
  // studentId: number;

  @Column()
  firstName: string;

  @Column()
  middleName: string;

  @Column()
  otherNames: string;

  @Column()
  age: number;

  @Column()
  gender: string;

  @Column()
  lgaOfOrigin: string;

  @Column()
  stateOfOrigin: string;

  @Column()
  parentsNumber: string;

  @Column()
  parentsAddress: string;

  @Column()
  dateOfBirth: Date;

  @ManyToOne(() => ClassEntity, (classEntity) => classEntity.students)
  studentClass: ClassEntity;  

  @Column({ nullable: true })
  medicalReportFilename: string;

  @Column({ nullable: true })
  birthCertificateFilename: string;

  @Column({ nullable: true })
  pictureFilename: string;

  @Column()
  studentIdentifier: string;

  @Column({ nullable: true })
  password: string; 
  
  @ManyToMany(() => Subject, (subject) => subject.students)
  @JoinTable()
  subjects: Subject[];

  @OneToMany(() => Result, (result) => result.student)
  results: Result[];
}
