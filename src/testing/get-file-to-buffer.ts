import { createReadStream, ReadStream } from 'fs';

export const getFileToBuffer = (filename: string) => {
  const readStream = createReadStream(filename);
  const chunks = [];

  return new Promise<{ buffer: Buffer; stream: ReadStream }>(
    (resolve, reject) => {
      readStream.on('data', (chunk) => chunks.push(chunk)); // To read partials datas from the photo and push to array
      readStream.on('error', (err) => reject(err)); // when has error

      // If read all, will build a object from the Promise and return a buffer array from the chunks parts and the stream
      readStream.on('close', () => {
        resolve({
          buffer: Buffer.concat(chunks) as Buffer,
          stream: readStream,
        });
      });
    },
  );
};
