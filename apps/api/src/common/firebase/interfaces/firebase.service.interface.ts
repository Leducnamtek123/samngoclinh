import {
    IFirebasePushPayload,
    IFirebasePushResult,
} from '@common/firebase/interfaces/firebase.interface';
import { DecodedIdToken } from 'firebase-admin/auth';

export interface IFirebaseService {
    isInitialized(): boolean;
    verifyIdToken(idToken: string): Promise<DecodedIdToken>;
    sendPush(token: string, payload: IFirebasePushPayload): Promise<boolean>;
    sendMulticast(
        tokens: string[],
        payload: IFirebasePushPayload,
        chunkSize?: number
    ): Promise<IFirebasePushResult>;
}
