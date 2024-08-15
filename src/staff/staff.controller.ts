import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Request, UnauthorizedException, Logger, UseGuards } from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto, LoginStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { Role } from '../models/user.model';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiBearerAuth, ApiConsumes, ApiTags, ApiOkResponse, ApiBadRequestResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Roles } from 'src/admin/roles.decorator';
import { Staff } from './entities/staff.entity';

@ApiTags('teacher')
@Controller('teacher')
export class StaffController {
  private readonly logger = new Logger(StaffController.name);
  constructor(private readonly staffService: StaffService) {}
  

  @Post()
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiConsumes('multipart/form-data', 'application/json')
  async create(@Body() createStaffDto: CreateStaffDto) {
    return await this.staffService.create(createStaffDto);
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async findAll() {
    return await this.staffService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async findOne(@Param('id') id: string): Promise<Staff> {
    const staff = await this.staffService.findOne(+id);
    if (!staff) {
      throw new NotFoundException(`Staff with ID ${id} not found`);
    }
    return staff;
  }

  @Patch(':teacherId')
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async update(
    @Param('teacherId') teacherId: number,
    @Body() updateStaffDto: UpdateStaffDto,
  ) {
    return await this.staffService.update(teacherId, updateStaffDto);
  }

  @Delete(':teacherId')
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async remove(@Param('teacherId') teacherId: number) {
    return await this.staffService.remove(teacherId);
  }

  @Post('login')
  @ApiOkResponse({
    description: 'Teacher has been logged in successfully',
  })
  @ApiBadRequestResponse({
    description: 'Error occurred during login',
  })
  async login(@Body() loginStaffDto: LoginStaffDto) {
    try {
      const { token } = await this.staffService.login(loginStaffDto);
      return { token };
    } catch (error) {
      throw error; 
    }
  }


 
  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'User profile has been returned',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User is not authenticated',
  })
  async getProfile(@Request() req: any) {
    const user = req.user;
    return user;
  }
}
