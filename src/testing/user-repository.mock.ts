import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { userEntityList } from './user-entity-list.mock';

//To create a mock, tahe the repository in test and the methods in used by the repository

export const userRepositoryMock = {
  provide: getRepositoryToken(UserEntity),
  useValue: {
    create: jest.fn(),
    save: jest.fn().mockResolvedValue(userEntityList[0]),
    find: jest.fn().mockResolvedValue(userEntityList),
    findOneBy: jest.fn().mockResolvedValue(userEntityList[0]),
    update: jest.fn(),
    delete: jest.fn(),
    exists: jest.fn().mockResolvedValue(false),
  },
};
