import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { userRepositoryMock } from '../testing/user-repository.mock';
import { userEntityList } from '../testing/user-entity-list.mock';
import { createUserDTO } from '../testing/create-user-dto.mock';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { updatePatchDTO, updateUserDTO } from '../testing/update-user-dto.mock';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<UserEntity>;
  beforeEach(async () => {
    // Create the module with providers to test (Environment test is separated from aplication so need create the module again)

    const module: TestingModule = await Test.createTestingModule({
      // Provider is the service class and the mocks to each dependecy from constructor class
      providers: [UserService, userRepositoryMock],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(UserEntity)); // To use the userRepository from userService and can manipulate caller from repository
  });

  it('Definition validate', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('Create', () => {
    it('Method create', async () => {
      const result = await userService.create(createUserDTO);

      expect(result).toEqual(userEntityList[0]);
    });
  });

  describe('Read', () => {
    it('Method list', async () => {
      const result = await userService.list();
      expect(result).toEqual(userEntityList);
    });

    it('Method getOne', async () => {
      //Its neccessary manipulate the exists method from userRepository because was declareted in exists method mock that value is false and the getOne method need a true value returned from exists.
      jest.spyOn(userRepository, 'exists').mockResolvedValueOnce(true);

      const result = await userService.getOne(
        '4439b775-9520-484e-9660-97f8635fa37d',
      );
      expect(result).toEqual(userEntityList[0]);
    });
  });

  describe('Update', () => {
    afterEach(() => {
      // Restore only exists mock to original value to not affect other tests
      jest.spyOn(userRepository, 'exists').mockRestore();
    });
    it('Method Update', async () => {
      //Its neccessary manipulate the exists method from userRepository because was declareted in exists method mock that value is false and the update and getOne method need a true value returned from exists.
      //So use only mockResolvedValue or use 2 times the mockResolvedValueOnce because exists method is called 2 times.
      jest.spyOn(userRepository, 'exists').mockResolvedValue(true);

      const result = await userService.update(
        updateUserDTO,
        '4439b775-9520-484e-9660-97f8635fa37d',
      );
      expect(result).toEqual(userEntityList[0]);
    });

    it('Method UpdatePartial', async () => {
      //Its neccessary manipulate the exists method from userRepository because was declareted in exists method mock that value is false and the update and getOne method need a true value returned from exists.
      //So use only mockResolvedValue or use 2 times the mockResolvedValueOnce because exists method is called 2 times.
      jest.spyOn(userRepository, 'exists').mockResolvedValue(true);

      const result = await userService.updatePartial(
        updatePatchDTO,
        '4439b775-9520-484e-9660-97f8635fa37d',
      );
      expect(result).toEqual(userEntityList[0]);
    });
  });

  describe('Delete', () => {
    it('Method delete', async () => {
      jest.spyOn(userRepository, 'exists').mockResolvedValueOnce(true);
      await userService.delete('4439b775-9520-484e-9660-97f8635fa37d');

      expect(userRepository.delete).toHaveBeenCalledWith(
        '4439b775-9520-484e-9660-97f8635fa37d',
      );
      expect(userRepository.delete).toHaveBeenCalledTimes(1);
    });
  });
});
