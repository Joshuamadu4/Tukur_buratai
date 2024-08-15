import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verify, sign } from 'jsonwebtoken';
import { DecodedToken } from './decoded-token.interface';
import { Request } from 'express';
import { UserService } from 'src/admin/admin.service';

@Injectable()
export class AuthService {
  private readonly blacklistedTokens: Set<string> = new Set();
  private readonly jwtSecret: string;

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    this.jwtSecret =
      this.configService.get<string>('JWT_SECRET') || 'default_jwt_secret';
  }

  signToken(userId: string, username: string, role: string): string {
    return sign({ userId, username, role }, this.jwtSecret, {
      expiresIn: '1d',
    });
  }
  signTeacherToken(name: string, email: string): string {
    return sign(
      { name, email, role: 'teacher' }, // Specific payload for teachers
      this.jwtSecret,
      { expiresIn: '1h' }
    );
  }
  

  

  async validateLogin(userId: number, password: string): Promise<boolean> {
    const user = await this.userService.findByID(userId);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Add password validation logic here
    return true;
  }

  blacklistToken(token: string): void {
    this.blacklistedTokens.add(token);
  }

  clearTokenFromBlacklist(token: string): void {
    this.blacklistedTokens.delete(token);
  }

  isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }

  resolveToken(token: string): DecodedToken {
    try {
      return verify(token, this.jwtSecret) as DecodedToken;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  extractFromHeaders(req: Request): string {
    const tokenWithBearer = req.headers.authorization;

    if (!tokenWithBearer || !tokenWithBearer.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Invalid or missing authorization header',
      );
    }

    return tokenWithBearer.split(' ')[1];
  }

  logout(req: Request): void {
    const token = this.extractFromHeaders(req);
    this.blacklistToken(token);
  }

  isLoggedIn(req: Request): boolean {
    try {
      const token = this.extractFromHeaders(req);

      if (this.isTokenBlacklisted(token)) {
        return false;
      }

      const decodedToken: DecodedToken = this.resolveToken(token);
      return (
        !!decodedToken.userId && !!decodedToken.username && !!decodedToken.role
      );
    } catch (error) {
      return false;
    }
  }
}
