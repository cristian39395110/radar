import { SetMetadata } from '@nestjs/common';
export const ROLES = ['admin', 'employer', 'developer'] as const;
export type Role = (typeof ROLES)[number];

export const IS_PUBLIC_KEY = 'is-public';

export const ACCESS_LEVEL_KEY = 'access-level';

export const IS_IMAGE_KEY = 'image-key';

export const IsPublic = () => SetMetadata(IS_PUBLIC_KEY, true);

export const AcceptUser = (...roles: Role[]) =>
  SetMetadata(ACCESS_LEVEL_KEY, roles);

export const IsImage = () => SetMetadata(IS_IMAGE_KEY, true);
