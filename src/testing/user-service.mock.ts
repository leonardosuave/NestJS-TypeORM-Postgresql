import { UserService } from '../user/user.service';
import { userEntityList } from './user-entity-list.mock';

//To create a mock to the constructor dependency userService from auth.service.

export const userServiceMock = {
  provide: UserService,
  useValue: {
    create: jest.fn().mockResolvedValue(userEntityList[0]),
    getOne: jest.fn().mockResolvedValue(userEntityList[0]),
    list: jest.fn().mockResolvedValue(userEntityList),
    existUser: jest.fn(),
    update: jest.fn().mockResolvedValue(userEntityList[0]),
    updatePartial: jest.fn().mockResolvedValue(userEntityList[0]),
    delete: jest.fn().mockResolvedValue(true),
    hashPassword: jest
      .fn()
      .mockResolvedValue(
        '$2y$10$cdvikf56b.gOSB59VQpxhu5LV1CgDh1xbaDAUaTvERvZYkpyT9aR2',
      ),
  },
};
