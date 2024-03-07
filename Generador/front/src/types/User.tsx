import { Role } from "../dopplerApi/types/AdminUser";

export interface User {
  access_token: string;
  fullName: string;
  roles: Role[];
}

