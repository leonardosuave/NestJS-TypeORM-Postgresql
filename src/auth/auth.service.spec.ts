import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { userRepositoryMock } from '../testing/user-repository.mock';
import { jwtServiceMock } from '../testing/jwt-service.mock';
import { userServiceMock } from '../testing/user-service.mock';
import { mailerServiceMock } from '../testing/mailer-service.mock';
import { userEntityList } from '../testing/user-entity-list.mock';
import { accessToken, jwtPayload, resetToken } from '../testing/token.mock';
import { registerAuthDTO } from '../testing/auth-register-dto.mock';
import { firebaseRepositoryMock } from '../testing/firebase-repository.mock';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    // Create the module with providers to test

    const module: TestingModule = await Test.createTestingModule({
      // Provider is the service class and the mocks to each dependecy from constructor class
      providers: [
        AuthService,
        userRepositoryMock,
        jwtServiceMock,
        userServiceMock,
        mailerServiceMock,
        firebaseRepositoryMock,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  test('Definition Validation', () => {
    expect(AuthService).toBeDefined();
  });

  describe('Token', () => {
    it('createToken method', () => {
      const result = authService.createToken(userEntityList[0]);
      expect(result).toEqual({ accessToken });
    });

    it('checkToken', () => {
      const result = authService.checkToken(accessToken);
      expect(result).toEqual(jwtPayload);
    });

    it('isValidToken', () => {
      const result = authService.isValidToken(accessToken);
      expect(result).toEqual(true);
    });
  });

  describe('Authentication', () => {
    it('login method', async () => {
      const result = await authService.login({
        email: 'leonardo@email.com',
        password: 'Senha@123',
      });
      expect(result).toEqual({ accessToken });
    });

    it('forgetPassword method', async () => {
      const result = await authService.forgetPassword({
        email: 'leonardo@email.com',
      });
      expect(result).toEqual(true);
    });

    it('resetPassword method', async () => {
      const result = await authService.resetPassword({
        password: 'P@lmeiras12345',
        token: resetToken,
      });
      expect(result).toEqual({ accessToken });
    });

    it('register method', async () => {
      const result = await authService.register(registerAuthDTO);
      expect(result).toEqual({ accessToken });
    });
  });
});
