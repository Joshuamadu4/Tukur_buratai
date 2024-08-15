import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Student } from 'src/student/entities/student.entity';
import { Subject } from 'src/subjects/entities/subject.entity';
import { Staff } from 'src/staff/entities/staff.entity';

@Entity('class_entity')
export class ClassEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  name: string; // e.g., Nursery 1, Primary 1

  @OneToMany(() => Student, (student) => student.studentClass)
  students: Student[];

  @OneToMany(() => Subject, (subject) => subject.classTitle)
  subjects: Subject[];

  @OneToMany(() => Staff, (teacher) => teacher.classroom)
  teachers: Staff[];
}
