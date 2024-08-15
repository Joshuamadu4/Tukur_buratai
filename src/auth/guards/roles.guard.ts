import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';
import { Role } from '../../models/user.model';
import { ROLES_KEY } from 'src/admin/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector, private authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.authService.extractFromHeaders(request);

    if (!token) {
      this.logger.warn('No token found in request headers');
      throw new UnauthorizedException('Token is missing');
    }

    try {
      const { userId, role, username } = this.authService.resolveToken(token);
      request.user = { userId, role, username };

      if (!requiredRoles.includes(role as Role)) {
        this.logger.warn(`User with role ${role} does not have the required permissions: ${requiredRoles}`);
        throw new UnauthorizedException('Insufficient permissions');
      }

      return true;
    } catch (error) {
      this.logger.error('Unauthorized access', error instanceof Error ? error.message : error);
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
