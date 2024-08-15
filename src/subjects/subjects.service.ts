import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Subject } from './entities/subject.entity';
import { ClassEntity } from 'src/class/entities/class.entity';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
    @InjectRepository(ClassEntity)
    private classRepository: Repository<ClassEntity>,
  ) {}

  async create(createSubjectDto: CreateSubjectDto) {
    try {
      const classEntity = await this.classRepository.findOne({ where: { name: createSubjectDto.classTitle } });
      if (!classEntity) {
        throw new BadRequestException(`Class ${createSubjectDto.classTitle} not found`);
      }

      const newSubject = this.subjectRepository.create({
        ...createSubjectDto,
        classTitle: classEntity,
      });

      return await this.subjectRepository.save(newSubject);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create subject');
    }
  }

  async findAll(): Promise<Subject[]> {
    return this.subjectRepository.find({
      relations: ['classTitle', 'students', 'teachers'],
    });
  }

  async findOne(id: number): Promise<Subject> {
    const subject = await this.subjectRepository.findOne({
      where: { id },
      relations: ['classTitle', 'students', 'teachers'],
    });

    if (!subject) {
      throw new BadRequestException(`Subject with ID ${id} not found`);
    }

    return subject;
  }

  async update(id: number, updateSubjectDto: UpdateSubjectDto) {
    try {
      const classEntity = updateSubjectDto.classTitle
        ? await this.classRepository.findOne({ where: { name: updateSubjectDto.classTitle } })
        : undefined;

      const subject = await this.subjectRepository.findOne({ where: { id } });
      if (!subject) {
        throw new BadRequestException(`Subject with ID ${id} not found`);
      }

      Object.assign(subject, updateSubjectDto);
      if (classEntity) {
        subject.classTitle = classEntity;
      }

      return await this.subjectRepository.save(subject);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update subject');
    }
  }

  async remove(id: number) {
    try {
      const subject = await this.findOne(id);
      await this.subjectRepository.remove(subject);
      return { message: 'Subject successfully deleted' };
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete subject');
    }
  }
}
