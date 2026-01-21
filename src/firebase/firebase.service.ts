import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';

@Injectable()
export class FirebaseService implements OnModuleInit {
  onModuleInit() {
    const serviceAccountPath = path.resolve(__dirname, '../../sowwork-firebase-service.json');
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
    });
  }

  async sendNotification(token: string, title: string, body: string, data?: any) {
    try {
      const res = await admin.messaging().send({
        token: token,
        notification: {
          title,
          body,
        },
        data: data || {},
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            channelId: 'default',
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              contentAvailable: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('FCM Error:', error);
    }
  }
}