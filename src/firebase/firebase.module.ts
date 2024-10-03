import { Module } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FirebaseService } from './firebase.service';

@Module({
  providers: [
    {
      provide: 'FIREBASE_ADMIN',
      useFactory: () => {
        const credential = process.env.GOOGLE_APPLICATION_CREDENTIALS;
        const bucket = process.env.STORAGE_BUCKET;

        return admin.initializeApp({
          credential: admin.credential.cert(credential as admin.ServiceAccount),
          storageBucket: bucket,
        });
      },
    },
    FirebaseService,
  ],
  exports: [FirebaseService],
})
export class FirebaseModule {}
