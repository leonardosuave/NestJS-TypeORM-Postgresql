import { PartialType } from '@nestjs/mapped-types';
import { User as UserPrisma } from '@prisma/client';

class User implements Omit<UserPrisma, 'password' | 'createdAt' | 'updatedAt'> {
  id: string;
  name: string;
  email: string;
  role: string;
}

// @UpdatePatchUserDTO used to customer params decorator
export class UserMEPartialDTO extends PartialType(User) {}
