import { ClassEntity } from 'src/class/entities/class.entity';
import { Result } from 'src/result/entities/result.entity';
import { Staff } from 'src/staff/entities/staff.entity';
import { Student } from 'src/student/entities/student.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  JoinTable,
  OneToMany,
  ManyToOne,
  ManyToMany,
  Index,
} from 'typeorm';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  subjectName: string;

  @Column()
  description: string;

  @ManyToOne(() => ClassEntity, (classEntity) => classEntity.subjects, { eager: true })
  classTitle: ClassEntity;

  @Column()
  @Index()
  categoryId: number;

  @Column()
  addedBy: string;

  @ManyToMany(() => Student, (student) => student.subjects)
  @JoinTable()
  students: Student[];

  @ManyToMany(() => Staff, (staff) => staff.subjects)
  @JoinTable()
  teachers: Staff[];

  @OneToMany(() => Result, (result) => result.subject)
  results: Result[];
}
