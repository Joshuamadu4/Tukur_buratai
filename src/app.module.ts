import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './admin/admin.module';
import { StudentModule } from './student/student.module';
import { SubjectsModule } from './subjects/subjects.module';
import { StaffModule } from './staff/staff.module';
import { UserEntity } from './models/user.model';
import { Student } from './student/entities/student.entity';
import { Subject } from './subjects/entities/subject.entity';
import { Staff } from './staff/entities/staff.entity';
import { Term } from './term/entities/term.entity';
import { RolesGuard } from './auth/guards/roles.guard';
import { TokenBlacklistMiddleware } from './auth/token-blacklist.middleware';
import { TermModule } from './term/term.module';
import { ClassModule } from './class/class.module';
import { ClassEntity } from './class/entities/class.entity';
import { ResultModule } from './result/result.module';
import { Result } from './result/entities/result.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [
          UserEntity,
          Student,
          Subject,
          Staff,
          ClassEntity,
          Term,
          Result,
          
        ],
        synchronize: true, 
        migrations: ['dist/migration/**/*.js'],
        cli: {
          migrationsDir: 'src/migration',
        },
      }),
    }),
    MulterModule.register({
      dest: './uploads',
    }),
    AuthModule,
    UserModule,
    StudentModule,
    SubjectsModule,
    StaffModule,
    TermModule,
    ClassModule,
    ResultModule,
    ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenBlacklistMiddleware).forRoutes('*');
  }
}
