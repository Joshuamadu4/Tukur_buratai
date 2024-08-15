import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { ClassEntity } from './entities/class.entity';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(ClassEntity)
    private classRepository: Repository<ClassEntity>,
  ) {}

  async create(createClassDto: CreateClassDto): Promise<ClassEntity> {
    try {
      if (!createClassDto.name) {
        throw new BadRequestException('Class name is required');
      }
  
      const newClass = this.classRepository.create(createClassDto);
      return await this.classRepository.save(newClass);
    } catch (error) {
      console.error('Error creating class:', error.message);
      throw new InternalServerErrorException('Failed to create class');
    }
  }

  findAll(): Promise<ClassEntity[]> {
    return this.classRepository.find();
  }

  async findOne(id: number): Promise<ClassEntity> {
    const classroom = await this.classRepository.findOneBy({ id });
    if (!classroom) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }
    return classroom;
  }

  async update(
    id: number,
    updateClassDto: UpdateClassDto,
  ): Promise<ClassEntity> {
    await this.classRepository.update(id, updateClassDto);
    const updatedClass = await this.classRepository.findOneBy({ id });
    if (!updatedClass) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }
    return updatedClass;
  }

  async remove(id: number): Promise<void> {
    const result = await this.classRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }
  }
}
