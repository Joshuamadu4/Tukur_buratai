import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Staff } from './entities/staff.entity';
import { CreateStaffDto, LoginStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { AuthService } from '../auth/auth.service'; // Make sure this is imported correctly
import { compare, hash } from 'bcryptjs';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
    private authService: AuthService, // Inject AuthService here
  ) {}

  async create(createStaffDto: CreateStaffDto): Promise<Staff> {
    const hashedPassword = await hash(createStaffDto.password, 10);
    const staff = this.staffRepository.create({ 
      ...createStaffDto, 
      password: hashedPassword 
    });
    return this.staffRepository.save(staff);
  }

  findAll(): Promise<Staff[]> {
    return this.staffRepository.find();
  }

  async findOne(id: number): Promise<Staff> {
    const staff = await this.staffRepository.findOne({
      where: { id },
    });
    if (!staff) {
      throw new NotFoundException(`Staff with ID ${id} not found`);
    }
    return staff;
  }

  async login(loginStaffDto: LoginStaffDto) {
    const { email, password } = loginStaffDto;
  
    // Find the staff by email
    const staff = await this.staffRepository.findOne({ where: { email } });
  
    if (!staff) {
      throw new BadRequestException('Staff does not exist');
    }
  
    // Authenticate the staff by comparing passwords
    const isAuth = await compare(password, staff.password);
   
  
    if (!isAuth) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
   // Generate specialized JWT token for teachers
   const token = this.authService.signTeacherToken(
    String(staff.id),
    staff.email
  );
  
    return { token };
  }
  


  async update(id: number, updateStaffDto: UpdateStaffDto): Promise<Staff> {
    const staff = await this.findOne(id);
    Object.assign(staff, updateStaffDto);
    return this.staffRepository.save(staff);
  }

  async remove(id: number): Promise<void> {
    const staff = await this.findOne(id);
    await this.staffRepository.remove(staff);
  }
}
