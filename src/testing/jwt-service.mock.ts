import { JwtService } from '@nestjs/jwt';
import { accessToken, jwtPayload } from './token.mock';

//To create a mock to the constructor dependency jwtService from auth.service.

export const jwtServiceMock = {
  provide: JwtService,
  useValue: {
    sign: jest.fn().mockReturnValue(accessToken),
    verify: jest.fn().mockReturnValue(jwtPayload),
  },
};
