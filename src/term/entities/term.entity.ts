import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Term {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // e.g., First Term, Second Term, Third Term

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  
}
