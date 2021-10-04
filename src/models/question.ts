import { Timestamp } from 'firebase/firestore';

export interface Question {
    id: string;
    senderUID: string;
    reciverUID: string;
    body: string;
    isReplied: boolean;
    createdAt: Timestamp;
}
