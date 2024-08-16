import { Role } from '../enums/role.enum';
import { UserEntity } from '../user/entity/user.entity';

export const userEntityList: UserEntity[] = [
  {
    id: 'afb97271-33bf-4784-a781-4da57b13f5a9',
    name: 'Leonardo Suave',
    email: 'leonardo@email.com',
    password: '$2b$10$ZktbCuQNvONU4dnEfvZhbeh4UkB9QbdCzv/JcvbRP7bLA3ICcSVAa',
    role: Role.ADMIN,
  },
  {
    id: 'afb97271-33bf-4784-a781-4da57b13f5a8',
    name: 'Tassiane',
    email: 'Tassiane@email.com',
    password: '$2b$10$ZktbCuQNvONU4dnEfvZhbeh4UkB9QbdCzv/JcvbRP7bLA3ICcSVAa',
    role: Role.MASTER,
  },
  {
    id: 'afb97271-33bf-4784-a781-4da57b13f5a7',
    name: 'Judite',
    email: 'judite@email.com',
    password: '$2b$10$ZktbCuQNvONU4dnEfvZhbeh4UkB9QbdCzv/JcvbRP7bLA3ICcSVAa',
    role: Role.NORMAL,
  },
];
