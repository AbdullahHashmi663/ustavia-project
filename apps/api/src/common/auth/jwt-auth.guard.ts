import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import type { UserRole } from '@ustavia/shared';

export interface AuthenticatedRequest extends Request {
  user: { id: string; role: UserRole };
}

/**
 * Lightweight JWT guard — a hand-rolled Bearer check via JwtService rather
 * than @nestjs/passport + passport-jwt, to keep the auth surface small for
 * this MVP pass. Swap for passport-jwt later if the app needs additional
 * strategies (OAuth, refresh-token rotation, etc.); the {id, role} shape on
 * req.user is what every guarded controller here depends on.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }
    try {
      const payload = this.jwt.verify<{ sub: string; role: UserRole }>(header.slice('Bearer '.length));
      req.user = { id: payload.sub, role: payload.role };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
