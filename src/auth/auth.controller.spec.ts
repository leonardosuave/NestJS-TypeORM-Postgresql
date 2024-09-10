import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../guards/auth.guard';
import { guardMock } from '../testing/guard.mock';
import { AuthController } from './auth.controller';
import { authServiceMock } from '../testing/auth-service.mock';
import { fileServiceMock } from '../testing/file-service.mock';
import { authLoginDTO } from '../testing/auth-login-dto.mock';
import { accessToken, jwtPayload, resetToken } from '../testing/token.mock';
import { registerAuthDTO } from '../testing/auth-register-dto.mock';
import { userEntityList } from '../testing/user-entity-list.mock';
import { getPhoto } from '../testing/get-photo.mock';
import { AuthStatusGuard } from '../guards/auth-status.guard';
import {
  authStatusGuardMock,
  requestAuthStatusGuardMock,
} from '../testing/auth-status-guard.mock';

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [authServiceMock, fileServiceMock],
    })
      .overrideGuard(AuthGuard)
      .useValue(guardMock)
      .overrideGuard(AuthStatusGuard)
      .useValue(authStatusGuardMock)
      .compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('Definition validate', () => {
    expect(authController).toBeDefined();
  });

  describe('Authenticate method', () => {
    it('Login method', async () => {
      const result = await authController.longin(authLoginDTO);
      expect(result).toEqual(accessToken);
    });

    it('Register method', async () => {
      const result = await authController.register(registerAuthDTO);
      expect(result).toEqual(accessToken);
    });

    it('Register method', async () => {
      const result = await authController.forgetPassword({
        email: authLoginDTO.email,
      });
      expect(result).toEqual(true);
    });

    it('reset-password method', async () => {
      const result = await authController.resetPassword({
        token: resetToken,
        password: 'P@lmeiras123',
      });
      expect(result).toEqual(accessToken);
    });
  });

  describe('User logged infos', () => {
    it('Me method', async () => {
      const result = await authController.me(userEntityList[0], {
        userByToken: jwtPayload,
      });

      expect(result).toEqual({ ...userEntityList[0], userByToken: jwtPayload });
    });

    it('meStatus method', async () => {
      const result = await authController.meStatus(requestAuthStatusGuardMock);

      expect(result).toEqual({ status: true });
    });
  });

  describe('Photos', () => {
    it('uploadPhoto method', async () => {
      const photo = await getPhoto();
      const result = await authController.uploadPhoto(userEntityList[0], photo);
      expect(result).toEqual({ status: 'success' });
    });
  });
});
