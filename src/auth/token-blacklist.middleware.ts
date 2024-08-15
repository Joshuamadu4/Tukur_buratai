import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TokenBlacklistMiddleware implements NestMiddleware {
  private blacklistedTokens: Set<string> = new Set();

  use(req: Request, res: Response, next: NextFunction) {
    const token = this.extractTokenFromRequest(req);

    if (this.isTokenBlacklisted(token)) {
      return res.status(401).json({ message: 'Token is blacklisted' });
    }

    next();
  }

  blacklistToken(token: string) {
    this.blacklistedTokens.add(token);
  }

  private extractTokenFromRequest(req: Request): string | null {
    const tokenWithBearer = req.headers.authorization;

    if (!tokenWithBearer) {
      return null;
    }

    const token = tokenWithBearer.split(' ')[1];

    return token || null;
  }

  private isTokenBlacklisted(token: string | null): boolean {
    return token !== null && this.blacklistedTokens.has(token);
  }
}
