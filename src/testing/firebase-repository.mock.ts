// Generic to not return error when execute auth service and controller test.

import { FirebaseService } from '../firebase/firebase.service';

export const firebaseRepositoryMock = {
  provide: FirebaseService,
  useValue: {
    createUser: jest.fn(),
    uploadFile: jest.fn(),
    updateSelectPhoto: jest.fn(),
    deletePhoto: jest.fn(),
    getFilesPath: jest.fn(),
  },
};
