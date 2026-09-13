import { CanActivate, ExecutionContext, ForbiddenException, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { UserRole } from '@ustavia/shared';

import type { AuthenticatedRequest } from './jwt-auth.guard';

export const ROLES_KEY = 'roles';
/** `@Roles('customer')` / `@Roles('mazdoor')` — apply after @UseGuards(JwtAuthGuard, RolesGuard) so req.user is already set. */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<UserRole[] | undefined>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) return true;

    const { user } = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (!required.includes(user.role)) {
      throw new ForbiddenException(`This action requires role: ${required.join(' or ')}`);
    }
    return true;
  }
}
