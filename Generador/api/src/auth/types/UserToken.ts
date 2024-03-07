import { Role } from '../decorators/user.decorator';

export type UserToken = {
  id: string;
  roles: Role[];
};
