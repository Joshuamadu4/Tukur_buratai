import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStudentDto, StudentLoginDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';
import { ClassEntity } from 'src/class/entities/class.entity';
import { Subject } from 'src/subjects/entities/subject.entity';
import { AuthService } from 'src/auth/auth.service';
import { compare, hash } from 'bcryptjs';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    private authService: AuthService,
    @InjectRepository(ClassEntity)
    private classRepository: Repository<ClassEntity>,
    @InjectRepository(Subject) 
    private subjectRepository: Repository<Subject>,

    
  ) {}

  async findAll(): Promise<Student[]> {
    try {
      return await this.studentRepository.find({
        relations: ['studentClass', 'subjects'],
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve students');
    }
  }

  async findOne(identifier: string | number): Promise<Student> {
    try {
      const queryBuilder = this.studentRepository.createQueryBuilder('student');
      
      if (typeof identifier === 'number') {
        queryBuilder.where('student.id = :id', { id: identifier });
      } else {
        queryBuilder.where('student.studentIdentifier = :identifier', { identifier });
      }
      
      const student = await queryBuilder.getOne();

      if (!student) {
        throw new NotFoundException(`Student with identifier ${identifier} not found`);
      }

      return student;
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve student');
    }
  }

  // private generateRandomPassword(): string {
  //   const min = 100000; // Minimum 6-digit number
  //   const max = 999999; // Maximum 6-digit number
  //   return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
  // }

  async create(createStudentDto: CreateStudentDto): Promise<{ student: Student, plainPassword: string }> {
    try {
      const classEntity = await this.classRepository.findOne({ where: { name: createStudentDto.studentClass } });
      if (!classEntity) {
        throw new BadRequestException(`Class ${createStudentDto.studentClass} not found`);
      }
  
      const studentIdentifier = await this.generateStudentIdentifier(classEntity);
      const plainPassword = createStudentDto.password; // Use the password provided by the admin
      const hashedPassword = await hash(plainPassword, 10); // Hash the provided password
  
      const newStudent = this.studentRepository.create({
        ...createStudentDto,
        studentClass: classEntity,
        studentIdentifier,
        password: hashedPassword,
      });
  
      const savedStudent = await this.studentRepository.save(newStudent);
  
      return { student: savedStudent, plainPassword }; // Return the plaintext password
    } catch (error) {
      console.error('Error creating student:', error); // Add more detailed logging
      throw new InternalServerErrorException('Failed to create student');
    }
  }

  async update(id: number, updateStudentDto: UpdateStudentDto): Promise<Student> {
    try {
      const student = await this.findOne(id);
      Object.assign(student, updateStudentDto);
      return await this.studentRepository.save(student);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update student');
    }
  }

  async findAllByClass(className: string): Promise<Student[]> {
    try {
      const classEntity = await this.classRepository.findOne({ where: { name: className } });

      if (!classEntity) {
        throw new BadRequestException(`Class ${className} not found`);
      }

      return await this.studentRepository.find({
        where: { studentClass: classEntity },
        relations: ['studentClass', 'subjects'],
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve students by class');
    }
  }

  async findAllByClassWithSubjects(className: string): Promise<Student[]> {
    try {
      const classEntity = await this.classRepository.findOne({
        where: { name: className },
        relations: ['subjects'], // Fetch subjects related to the class
      });
  
      if (!classEntity) {
        throw new BadRequestException(`Class ${className} not found`);
      }
  
      // Fetch all subjects for the class
      const subjects = await this.subjectRepository.find({
        where: { classTitle: classEntity },
      });
  
      // Fetch all students and map subjects to them
      const students = await this.studentRepository.find({
        where: { studentClass: classEntity },
        relations: ['studentClass', 'subjects'],
      });
  
      students.forEach(student => {
        student.subjects = subjects; // Assign all subjects to the student
      });
  
      return students;
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve students by class');
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const student = await this.findOne(id);
      await this.studentRepository.remove(student);
      return { message: 'Student successfully deleted' };
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete student');
    }
  }

  async findOneId(id: number): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { id },
    });
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return student;
  }

  private async generateStudentIdentifier(studentClass: ClassEntity): Promise<string> {
    const year = new Date().getFullYear();
    const studentsInClass = await this.studentRepository.find({
      where: { studentClass },
    });
    const studentNumber = studentsInClass.length + 1;
    const studentNumberFormatted = studentNumber.toString().padStart(2, '0');
    return `PT/${year}/${studentClass.name}/${studentNumberFormatted}`;
  }

  async login(studentLoginDto: StudentLoginDto) {
    const { password, studentIdentifier } = studentLoginDto;

    // Find the student by identifier
    const student = await this.studentRepository.findOne({ where: { studentIdentifier } });

    if (!student) {
      throw new BadRequestException('Student does not exist');
    }

    // Authenticate the student by comparing passwords
    const isAuth = await compare(password, student.password); 

    if (!isAuth) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const token = this.authService.signToken(
      String(student.id),
      student.studentIdentifier,
      'student',
    );

    return { token };
  }
}
