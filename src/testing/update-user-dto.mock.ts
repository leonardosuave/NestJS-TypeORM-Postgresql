import { Role } from '../enums/role.enum';
import { UpdatePatchUserDTO } from '../user/dto/update-patch-user.dto';
import { UpdateUserDTO } from '../user/dto/update-user.dto';

export const updateUserDTO: UpdateUserDTO = {
  name: 'Leonardo Suave',
  email: 'leonardo@email.com',
  password: 'Senha@123',
  role: Role.ADMIN,
};

export const updatePatchDTO: UpdatePatchUserDTO = {
  name: 'New Leonardo Suave',
}
