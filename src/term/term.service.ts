import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTermDto } from './dto/create-term.dto';
import { UpdateTermDto } from './dto/update-term.dto';
import { Term } from './entities/term.entity';

@Injectable()
export class TermService {
  constructor(
    @InjectRepository(Term)
    private termRepository: Repository<Term>,
  ) {}

  create(createTermDto: CreateTermDto): Promise<Term> {
    const term = this.termRepository.create(createTermDto);
    return this.termRepository.save(term);
  }

  findAll(): Promise<Term[]> {
    return this.termRepository.find();
  }

  async findOne(id: number): Promise<Term> {
    const term = await this.termRepository.findOneBy({ id });
    if (!term) {
      throw new NotFoundException(`Term with ID ${id} not found`);
    }
    return term;
  }

  async update(id: number, updateTermDto: UpdateTermDto): Promise<Term> {
    await this.termRepository.update(id, updateTermDto);
    const updatedTerm = await this.termRepository.findOneBy({ id });
    if (!updatedTerm) {
      throw new NotFoundException(`Term with ID ${id} not found`);
    }
    return updatedTerm;
  }

  async remove(id: number): Promise<void> {
    const result = await this.termRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Term with ID ${id} not found`);
    }
  }
}
