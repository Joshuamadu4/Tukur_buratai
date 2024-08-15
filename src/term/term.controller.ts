import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TermService } from './term.service';
import { CreateTermDto } from './dto/create-term.dto';
import { UpdateTermDto } from './dto/update-term.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/admin/roles.decorator';
import { Role } from 'src/models/user.model';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('Terms')
@Controller('terms')
export class TermController {
  constructor(private readonly termService: TermService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiConsumes('multipart/form-data', 'application/json')
  create(@Body() createTermDto: CreateTermDto) {
    return this.termService.create(createTermDto);
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiConsumes('multipart/form-data', 'application/json')
  findAll() {
    return this.termService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiConsumes('multipart/form-data', 'application/json')
  findOne(@Param('id') id: number) {
    return this.termService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiConsumes('multipart/form-data', 'application/json')
  update(@Param('id') id: number, @Body() updateTermDto: UpdateTermDto) {
    return this.termService.update(id, updateTermDto);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiConsumes('multipart/form-data', 'application/json')
  remove(@Param('id') id: number) {
    return this.termService.remove(id);
  }
}
