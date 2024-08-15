import { AuthService } from '../auth/auth.service';
import { UserService } from './admin.service';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { UserRegister, UserLoginDto, UserWithID } from './admin.dto';
import { User } from './admin.decorator';
import { Role } from '../models/user.model';
import { Roles } from './roles.decorator';
import {
  ApiBearerAuth,
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('admin')
@Controller('admin')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @ApiBearerAuth('JWT-auth')
  @Get('profile')
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

  @ApiBearerAuth('JWT-auth')
  @Get('all')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOkResponse({
    description: 'All users have been returned',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User is not authorized to view all users',
  })
  async getAll() {
    return (await this.userService.findAll()).map((user) => ({
      id: user.id,
      username: user.username,
      role: user.role,
    }));
  }

  //@ApiBearerAuth('JWT-auth')
  @Post('create')
  //@Roles(Role.Admin)
  //@UseGuards(AuthGuard, RolesGuard)
  @ApiCreatedResponse({
    description: 'User has been created',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User is not authorized to create users',
  })
  @ApiConsumes('application/x-www-form-urlencoded')
  async create(@Body() user: UserRegister) {
    const { id, role, username } = await this.userService.createAdmin(user);

    return { id, role, username };
  }

  @ApiBearerAuth('JWT-auth')
  @Delete('delete/:id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOkResponse({
    description: 'User has been deleted',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User is not authorized to delete users',
  })
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserWithID,
  ) {
    if (user.id === id) {
      throw new BadRequestException({
        message: 'You cannot delete your own account',
      });
    }

    await this.userService.removeUser(id);

    return { success: true };
  }

  @ApiBearerAuth('JWT-auth') // This name should match the one used in Swagger configuration
  @Get('id/:id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOkResponse({
    description: 'User has been returned',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User is not authorized to view this user',
  })
  async getByID(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findByID(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const { id: userID, role, username } = user;

    return { id: userID, role, username };
  }

  @ApiBearerAuth('JWT-auth')
  @Get('all/:skip')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOkResponse({
    description: 'Users have been returned',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User is not authorized to view all users',
  })
  async getPaginated(@Param('skip', ParseIntPipe) skip: number) {
    return (await this.userService.getPaginatedUsers(skip)).map((user) => ({
      id: user.id,
      username: user.username,
      role: [user.role],
    }));
  }

  @Post('login')
  @ApiCreatedResponse({
    description: 'User has been logged in successfully',
  })
  @ApiBadRequestResponse({
    description: 'Error occurred during login',
  })
  @ApiConsumes('application/x-www-form-urlencoded')
  async login(@Body() userLoginDto: UserLoginDto) {
    try {
      const user = await this.userService.logUser(userLoginDto);
      const token = this.authService.signToken(
        String(user.id),
        String(user.username),
        user.role,
      );
      const profile = await this.getProfile(user);
      return { user: profile, token };
    } catch (error) {
      this.logger.error('Error occurred during login', error);
      throw new HttpException(
        'Error occurred during login',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiBearerAuth('JWT-auth')
  @Post('logout')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'User has been logged out successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User is not authenticated',
  })
  async logout(@Request() req: any) {
    const user = req.user;
    if (user) {
      this.authService.logout(req);
      return { message: 'User logged out successfully' };
    } else {
      return { message: 'User not authenticated' };
    }
  }
}
