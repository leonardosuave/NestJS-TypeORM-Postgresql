import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FirebaseService {
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App,
  ) {}

  async createUser(
    email: string,
    password: string,
  ): Promise<admin.auth.UserRecord> {
    return this.firebaseAdmin.auth().createUser({ email, password });
  }

  async uploadFile(buffer: Buffer, destination: string): Promise<void> {
    const bucket = this.firebaseAdmin.storage().bucket();
    const file = bucket.file(destination);

    // Cria um stream para enviar o buffer para o Firebase Storage
    const stream = file.createWriteStream({
      metadata: {
        contentType: 'image/png',
        metadata: {
          firebaseStorageDownloadTokens: uuidv4(),
        },
      },
    });
    stream.end(buffer);

    return new Promise<void>((resolve, reject) => {
      stream.on('finish', () => {
        resolve();
      });

      stream.on('error', (error) => {
        reject(error);
      });
    });
  }

  async updateSelectPhoto(destination: string, fileName: string) {
    const fileType = fileName.split('.').pop();
    const newName = `${Date.now()}.${fileType}`;

    const bucket = this.firebaseAdmin.storage().bucket();
    const oldFile = bucket.file(destination + fileName);
    const newFile = bucket.file(destination + newName);

    await oldFile.copy(newFile);
    await oldFile.delete();
  }

  async deletePhoto(destination: string) {
    const bucket = this.firebaseAdmin.storage().bucket();
    await bucket.file(destination).delete();
  }

  async getFilesPath(userId: string) {
    const bucket = this.firebaseAdmin.storage().bucket();
    const [files] = await bucket.getFiles({
      prefix: `${process.env.ENV}/users/${userId}`,
    });
    return files.map((file) => file.name);
  }
}
