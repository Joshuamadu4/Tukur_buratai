import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  UploadedFiles,
  UseInterceptors,
  HttpException,
  HttpStatus,
  UseGuards,
  UnauthorizedException,
  Logger,
  Request,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto, StudentLoginDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiConsumes, ApiBody, ApiTags, ApiBearerAuth, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Student } from './entities/student.entity';
import { AuthService } from 'src/auth/auth.service';
import { Roles } from 'src/admin/roles.decorator';
import { Role } from 'src/models/user.model';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
// Removed unused imports
// import { compare } from 'bcryptjs';
// import { Repository } from 'typeorm';

@ApiTags('student')
@Controller('student')
export class StudentController {
  private readonly logger = new Logger(StudentController.name);

  constructor(
    private studentService: StudentService,
    private authService: AuthService,
  ) {}

  @Post('upload')
  @ApiBearerAuth('JWT-auth')
  // @Roles(Role.Admin)
  // @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        cb(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload files',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  async uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded.');
    }

    return files.map((file) => ({
      filename: file.filename,
      originalname: file.originalname,
    }));
  }

  @Post()
  @ApiBearerAuth('JWT-auth')
  // @Roles(Role.Admin)
  // @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiConsumes('application/json')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstName: { type: 'string' },
        middleName: { type: 'string' },
        otherNames: { type: 'string' },
        age: { type: 'number' },
        gender: { type: 'string', enum: ['male', 'female'] },
        lgaOfOrigin: { type: 'string' },
        stateOfOrigin: { type: 'string' },
        parentsNumber: { type: 'string' },
        parentsAddress: { type: 'string' },
        dateOfBirth: { type: 'string', format: 'date' },
        studentClass: { type: 'string' },
        medicalReport: { type: 'string' },
        birthCertificate: { type: 'string' },
        picture: { type: 'string' },
      },
    },
  })
  async create(@Body() createStudentDto: CreateStudentDto) {
    const { medicalReport, birthCertificate, picture } = createStudentDto;

    if (!medicalReport || !birthCertificate || !picture) {
      throw new BadRequestException(
        'Medical report, birth certificate, and picture filenames are required.',
      );
    }

    return this.studentService.create(createStudentDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Get('profile')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'Student profile has been returned',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Student is not authenticated',
  })
  async getProfile(@Request() req: any) {
    const student = req.user;
    return student;
  }

  @Post('login')
  async login(@Body() studentLoginDto: StudentLoginDto) {
    try {
      const { token } = await this.studentService.login(studentLoginDto);
      return { token };
    } catch (error) {
      this.logger.error('Error occurred during student login', error);
      throw new HttpException(
        'Error occurred during login',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async findAll(): Promise<Student[]> {
    return this.studentService.findAll();
  }

  @Get('/id/:id')
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.Admin, Role.Student, Role.Teacher)
  @UseGuards(AuthGuard, RolesGuard)
  async getStudentById(@Param('id') id: number): Promise<Student> {
    return this.studentService.findOneId(id);
  }

  @Get('/:identifier')
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.Admin, Role.Student, Role.Teacher)
  @UseGuards(AuthGuard, RolesGuard)
  async getStudent(@Param('identifier') identifier: string): Promise<Student> {
    const parsedId = parseInt(identifier, 10);
    const studentIdentifier = isNaN(parsedId) ? identifier : parsedId;
    return this.studentService.findOne(studentIdentifier);
  }

  @Get('/class/:studentClass')
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.Admin, Role.Teacher)
  @UseGuards(AuthGuard, RolesGuard)
  async getStudentsByClass(@Param('studentClass') studentClass: string): Promise<Student[]> {
    return this.studentService.findAllByClass(studentClass);
  }

  @Get('/class/:className/subjects')
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async getStudentsByClassWithSubjects(@Param('className') className: string): Promise<Student[]> {
    return this.studentService.findAllByClassWithSubjects(className);
  }

  @Delete('/:id')
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async removeStudent(@Param('id') id: number) {
    return this.studentService.remove(id);
  }

  @Patch('/:id/status')
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiConsumes('application/json')
  async updateStudent(
    @Param('id') id: number,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentService.update(id, updateStudentDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Post('logout')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'Student has been logged out successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Student is not authenticated',
  })
  async logout(@Request() req: any) {
    const student = req.user;
    if (student) {
      this.authService.logout(req);
      return { message: 'Student logged out successfully' };
    } else {
      return { message: 'Student not authenticated' };
    }
  }
}
