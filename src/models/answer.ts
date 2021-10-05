import { Timestamp } from '@firebase/firestore';

export interface Answer {
    id: string;
    uid: string;
    questionID: string;
    body: string;
    createdAt: Timestamp;
}
