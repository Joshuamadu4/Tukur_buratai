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
} from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Role } from 'src/models/user.model';
import { Roles } from 'src/admin/roles.decorator';
import { ApiTags, ApiBody, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { SubjectService } from './subjects.service';

@ApiTags('subjects')
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.Admin)
  @UsePipes(ValidationPipe)
  @ApiConsumes('application/json')
  @ApiBody({
    description: 'Create subject',
    type: CreateSubjectDto,
    required: true,
    schema: {
      type: 'object',
      properties: {
        Id: { type: 'number' },
        subjectName: { type: 'string' },
        description: { type: 'string' },
        classTitle: { type: 'string' },
        categoryId: { type: 'number' },
        addedBy: { type: 'string' },
      },
    },
  })
  create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectsService.create(createSubjectDto);
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.Admin)
  findAll() {
    return this.subjectsService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.Admin)
  findOne(@Param('id') id: number) {
    return this.subjectsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.Admin)
  @UsePipes(ValidationPipe)
  @ApiConsumes('application/json')
  @ApiBody({
    description: 'Update subject',
    type: UpdateSubjectDto,
    required: true,
    schema: {
      type: 'object',
      properties: {
        Id: { type: 'number' },
        subjectName: { type: 'string' },
        description: { type: 'string' },
        classTitle: { type: 'string' },
        categoryId: { type: 'number' },
        addedBy: { type: 'string' },
      },
    },
  })
  update(@Param('id') id: number, @Body() updateSubjectDto: UpdateSubjectDto) {
    return this.subjectsService.update(id, updateSubjectDto);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.subjectsService.remove(+id);
  }
}
