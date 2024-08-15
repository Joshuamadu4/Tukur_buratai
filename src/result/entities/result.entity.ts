import { Student } from "src/student/entities/student.entity";
import { Subject } from "src/subjects/entities/subject.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Result {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, (student) => student.results)
  student: Student;

  @ManyToOne(() => Subject, (subject) => subject.results)
  subject: Subject;

  @Column()
  term: string;

  @Column()
  session: string;

  @Column()
  year: number;

  @Column()
  nextTermBegins: string;

  @Column()
  firstHalfTermAssessment: number;

  @Column()
  firstHalfTermTest: number;

  @Column()
  secondHalfTermAssessment: number;

  @Column()
  secondHalfTermTest: number;

  @Column()
  termExam: number;

  @Column()
  termTotal: number;

  @Column()
  classAverage: number;

  @Column()
  highestInClass: number;

  @Column()
  lowestInClass: number;

  @Column()
  positionInClass: number;

  @Column()
  grade: string;

  @Column()
  teacherRemark: string;
}
