import { Role } from '../enums/role.enum';
import { CreateUserDTO } from '../user/dto/create-user.dto';

export const createUserDTO: CreateUserDTO = {
  name: 'Leonardo Suave',
  email: 'leonardo@email.com',
  password: 'Senha@123',
  role: Role.ADMIN,
};
