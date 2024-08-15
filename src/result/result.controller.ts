import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { ResultsService } from './result.service';
import { Result } from './entities/result.entity';

@Controller('result')
export class ResultController {
  constructor(private readonly resultService: ResultsService) {}

 

  @Post()
  create(@Body() createResultDto: Result): Promise<Result> {
    return this.resultService.create(createResultDto);
  }

//   @Get()
//   findAll() {
//     return this.resultService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.resultService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateResultDto: UpdateResultDto) {
//     return this.resultService.update(+id, updateResultDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.resultService.remove(+id);
//   }
 }
