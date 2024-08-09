import { PartialType } from '@nestjs/mapped-types';
import { UserEntity as User } from '../../user/entity/user.entity';

// @UpdatePatchUserDTO used to customer params decorator
export class UserMEPartialDTO extends PartialType(User) {}
