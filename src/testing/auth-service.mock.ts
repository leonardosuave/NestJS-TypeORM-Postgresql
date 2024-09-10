import { AuthService } from '../auth/auth.service';
import { accessToken, jwtPayload } from './token.mock';

//To create a mock to the constructor dependency userService from auth.service.

export const authServiceMock = {
  provide: AuthService,
  useValue: {
    createToken: jest.fn().mockResolvedValue(accessToken),
    checkToken: jest.fn().mockReturnValue(jwtPayload),
    isValidToken: jest.fn().mockReturnValue(true),
    login: jest.fn().mockResolvedValue(accessToken),
    forgetPassword: jest.fn().mockResolvedValue(true),
    resetPassword: jest.fn().mockResolvedValue(accessToken),
    register: jest.fn().mockResolvedValue(accessToken),
  },
};
