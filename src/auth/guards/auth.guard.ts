import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.authService.extractFromHeaders(request);

    try {
      const { userId, role, username } = this.authService.resolveToken(token);
      if (this.authService.isTokenBlacklisted(token)) {
        this.logger.warn(`Token is blacklisted: ${token}`);
        throw new UnauthorizedException('Token is blacklisted');
      }
      request.user = { userId, role, username };
      return true;
    } catch (error) {
      this.logger.error('Unauthorized access', error);
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
