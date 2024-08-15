import { UserRegister, UserLoginDto } from './admin.dto';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compare, hash } from 'bcryptjs';
import { UserEntity } from 'src/models/user.model';
import { randomBytes } from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private user: Repository<UserEntity>,
  ) {}

  findByID(id: number) {
    return this.user.findOne({ where: { id } });
  }

  findAll() {
    return this.user.find();
  }

  /** Creating an Admin User */
  async createAdmin(userDto: UserRegister): Promise<UserEntity> {
    const { username, password, confirmPassword, role } = userDto;

    // Check if the role is admin
    if (role !== 'admin') {
      throw new BadRequestException({ message: 'Only admin registration is allowed' });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      throw new BadRequestException({ message: 'Passwords do not match' });
    }

    // Check if user already exists
    const existingUser = await this.findByName(username);
    if (existingUser) {
      throw new BadRequestException({ message: 'User already exists' });
    }

    // Generate confirmation token
    const confirmationToken = this.generateConfirmationToken();

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user entity
    const user = this.user.create({
      username,
      role,
      hashedPassword,
      confirmationToken, // Add confirmation token to user entity
    });

    // Save user entity
    await this.user.save(user);

    // // Send confirmation email
    // await this.sendConfirmationEmail(user);

    return user;
  }

  private generateConfirmationToken(): string {
    return randomBytes(20).toString('hex');
  }

  async logUser({ password, username: name, role }: UserLoginDto) {
    // Find the user by username
    const user = await this.findByName(name);

    if (!user) {
      throw new BadRequestException({ message: 'User does not exist' });
    }

    // Check if the user's role matches the role provided in the login DTO
    if (user.role !== role) {
      throw new UnauthorizedException({
        message: 'User unauthorized for the specified role',
      });
    }

    // Authenticate the user by comparing passwords
    const isAuth = await compare(password, user.hashedPassword);

    if (!isAuth) {
      throw new UnauthorizedException({ message: 'User unauthorized' });
    }

    // Return the user's ID, role, and username upon successful authentication
    return { id: user.id, role: user.role, username: user.username };
  }

  getPaginatedUsers(skip: number) {
    return this.user.find({ skip, take: 10 });
  }

  removeUser(id: number) {
    return this.user.delete({ id });
  }

  findByName(username: string) {
    return this.user.findOne({ where: { username } });
  }
}
