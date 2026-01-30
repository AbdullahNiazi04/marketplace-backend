import { SetMetadata } from '@nestjs/common';

/**
 * User roles in the marketplace
 */
export type UserRole = 'Buyer' | 'Seller' | 'Admin';

/**
 * Roles decorator
 * 
 * Usage: @Roles('Seller', 'Admin')
 */
export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
