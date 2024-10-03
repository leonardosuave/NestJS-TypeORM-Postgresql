import { Inject, Injectable } from '@nestjs/common';
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
}
