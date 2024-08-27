import { join } from 'path';
import { getFileToBuffer } from './get-file-to-buffer';

export const getPhoto = async () => {
  const { buffer, stream } = await getFileToBuffer(
    join(__dirname, 'photo.png'),
  );

  // Photo with with all property from Express.Multer.File
  const photo: Express.Multer.File = {
    fieldname: 'file',
    originalname: 'photo.png',
    encoding: '7bit',
    mimetype: 'image/png',
    size: 1024 * 70,
    stream, // To be readable file
    destination: '',
    filename: '',
    path: 'file-path',
    buffer, // The file bits
  };

  return photo;
};
