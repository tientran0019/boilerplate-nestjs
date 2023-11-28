import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@modules/users/user.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]): ClassDecorator & MethodDecorator => SetMetadata(ROLES_KEY, roles);
