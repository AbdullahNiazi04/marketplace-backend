import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { auth } from '../../lib/auth.js';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        
        // Whitelist Swagger UI and public paths
        const path = request.path || request.url; // Handle various adapter inconsistencies
        if (
            path === '/' ||
            path.startsWith('/api/') && !path.startsWith('/api/v1') || // Swagger assets
            path === '/api'
        ) {
            return true;
        }

        const response = context.switchToHttp().getResponse();

        /**
         * Verify session using better-auth
         * We pass the request headers to let better-auth handle cookie parsing
         */
        const authInstance = await auth;
        const session = await authInstance.api.getSession({
            headers: request.headers,
        });

        if (!session) {
            throw new UnauthorizedException();
        }

        // Attach user and session to request object
        request.user = session.user;
        request.session = session.session;

        return true;
    }
}
