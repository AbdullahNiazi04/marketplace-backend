import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, UserRole } from '../decorators/roles.decorator';

/**
 * RolesGuard
 * 
 * Checks if the authenticated user has the required role(s).
 * Must be used after AuthGuard (which is global with Better Auth).
 * 
 * Usage: @UseGuards(RolesGuard) with @Roles('Seller', 'Admin')
 */
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // No roles required, allow access
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const session = request.session;

        // No session means user is not authenticated
        if (!session || !session.user) {
            throw new ForbiddenException('Authentication required');
        }

        const userRole = session.user.role || 'Buyer';
        const hasRole = requiredRoles.includes(userRole as UserRole);

        if (!hasRole) {
            throw new ForbiddenException(`Access denied. Required roles: ${requiredRoles.join(', ')}`);
        }

        return true;
    }
}
