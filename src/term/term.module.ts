import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TermService } from './term.service';
import { TermController } from './term.controller';
import { Term } from './entities/term.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Term])],
  controllers: [TermController],
  providers: [TermService],
})
export class TermModule {}
