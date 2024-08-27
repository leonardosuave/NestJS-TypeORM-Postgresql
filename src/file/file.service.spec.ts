import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from './file.service';
import { AuthService } from '../auth/auth.service';
import { getPhoto } from '../testing/get-photo.mock';

describe('FileService', () => {
  let fileService: FileService;

  beforeEach(async () => {
    // Create the module with providers to test

    const module: TestingModule = await Test.createTestingModule({
      providers: [FileService],
    }).compile();

    fileService = module.get<FileService>(FileService);
  });

  test('Definition Validation', () => {
    expect(AuthService).toBeDefined();
  });

  describe('File service test', () => {
    test('Upload method', async () => {
      const photo = await getPhoto();
      const fileName = 'photo-test.png';
      fileService.upload(photo, fileName);
    });
  });
});
