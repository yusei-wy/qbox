import '@/lib/firebase_admin';

import { firestore } from 'firebase-admin';
import { NextApiRequest, NextApiResponse } from 'next';

import { Answer } from '@/models/answer';
import { Question } from '@/models/question';

type Data = {
    answer: Answer;
    question: Question;
};

const getAnswer = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const id = req.query.id as string;

    const answerDoc = await firestore().collection('answers').doc(id).get();
    const answer = answerDoc.data() as Answer;
    answer.id = answerDoc.id;

    const questionDoc = await firestore().collection('questions').doc(answer.questionID).get();
    const question = questionDoc.data() as Question;

    res.status(200).json({ answer, question });
};

export default getAnswer;
