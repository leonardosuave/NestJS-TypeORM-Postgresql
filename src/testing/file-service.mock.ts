import { FileService } from '../file/file.service';

//To create a mock to the constructor dependency AuthController from auth.controller.

export const fileServiceMock = {
  provide: FileService,
  useValue: {
    getDestinationPath: jest.fn(),
    upload: jest.fn().mockResolvedValue(''),
  },
};
