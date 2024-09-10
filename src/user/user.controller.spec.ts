import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { userServiceMock } from '../testing/user-service.mock';
import { AuthGuard } from '../guards/auth.guard';
import { guardMock } from '../testing/guard.mock';
import { RoleGuard } from '../guards/role.guard';
import { UserService } from './user.service';
import { userEntityList } from '../testing/user-entity-list.mock';
import { createUserDTO } from '../testing/create-user-dto.mock';
import { updatePatchDTO, updateUserDTO } from '../testing/update-user-dto.mock';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [userServiceMock],
    })
      .overrideGuard(AuthGuard)
      .useValue(guardMock)
      .overrideGuard(RoleGuard)
      .useValue(guardMock)
      .compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('Definition validate', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('Test guards applicated in this controller', () => {
    it('guards applicated', () => {
      // To take the guards after compile, need to pass __guards__ because is where is the guards
      const guards = Reflect.getMetadata('__guards__', UserController);

      expect(guards.length).toEqual(2);

      //    To check the order need to check the Instance and to this call like a class when array is the name of the guards. (AuthGuard need to be call before RoleGuards like the order in controller)
      expect(new guards[0]()).toBeInstanceOf(AuthGuard);
      expect(new guards[1]()).toBeInstanceOf(RoleGuard);
    });
  });

  describe('Create', () => {
    it('Method create', async () => {
      const result = await userController.create(createUserDTO);
      expect(result).toEqual(userEntityList[0]);
    });
  });

  describe('Read', () => {
    it('Method Read', async () => {
      const result = await userController.read();
      expect(result).toEqual(userEntityList);
    });

    it('Method ReadOne', async () => {
      const result = await userController.readOne(
        '4439b775-9520-484e-9660-97f8635fa37d',
      );
      expect(result).toEqual(userEntityList[0]);
    });
  });

  describe('Update', () => {
    it('Method Read', async () => {
      const result = await userController.update(
        updateUserDTO,
        '4439b775-9520-484e-9660-97f8635fa37d',
      );
      expect(result).toEqual(userEntityList[0]);
    });

    it('Method updatePartial', async () => {
      const result = await userController.updatePartial(
        updatePatchDTO,
        '4439b775-9520-484e-9660-97f8635fa37d',
      );
      expect(result).toEqual(userEntityList[0]);
    });
  });

  describe('Delete', () => {
    it('Method delete', async () => {
      const result = await userController.delete(
        '4439b775-9520-484e-9660-97f8635fa37d',
      );
      expect(result).toEqual(true);
    });
  });
});
