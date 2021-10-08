import {
    collection,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    limit,
    query,
    runTransaction,
    serverTimestamp,
    Timestamp,
    where,
} from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';

import { Card } from '@/components/card';
import { Layout } from '@/components/layout';
import { Loading } from '@/components/loading';
import { useAuthentication } from '@/hooks/authentication';
import { Answer } from '@/models/answer';
import { Question } from '@/models/question';

type Props = {};

type Query = {
    id: string;
};

const QuestionPage: React.FC<Props> = (props) => {
    const router = useRouter();
    const routerQuery = router.query as Query;
    const { user } = useAuthentication();
    const [question, setQuestion] = useState<Question>(null);
    const [body, setBody] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [answer, setAnswer] = useState<Answer>(null);

    const getCollection = () => {
        const db = getFirestore();
        return {
            db,
            questionsCollection: collection(db, 'questions'),
            answersCollection: collection(db, 'answers'),
        };
    };

    const fetchData = async () => {
        if (routerQuery.id === undefined) {
            return;
        }

        const { questionsCollection, answersCollection } = getCollection();
        const questionDoc = await getDoc(doc(questionsCollection, routerQuery.id));
        if (!questionDoc.exists()) {
            return;
        }

        const gotQuestion = questionDoc.data() as Question;
        gotQuestion.id = questionDoc.id;
        setQuestion(gotQuestion);

        if (!gotQuestion.isReplied) {
            return;
        }

        const answerSnapshot = await getDocs(
            query(answersCollection, where('questionID', '==', gotQuestion.id), limit(1)),
        );
        if (answerSnapshot.empty) {
            return;
        }
        const gotAnswer = answerSnapshot.docs[0].data() as Answer;
        gotAnswer.id = answerSnapshot.docs[0].id;
        setAnswer(gotAnswer);
    };

    useEffect(() => {
        // rules でログインユーザーのみにしたため未認証のユーザーではエラーになる
        if (user === null) {
            return;
        }

        fetchData();
    }, [routerQuery.id]);

    const onSubmit = useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            const { db, questionsCollection, answersCollection } = getCollection();
            const answerRef = doc(answersCollection);

            await runTransaction(db, async (t) => {
                t.set(answerRef, {
                    uid: user.uid,
                    questionID: question.id,
                    body,
                    createdAt: serverTimestamp(),
                });
                t.update(doc(questionsCollection, question.id), {
                    isReplied: true,
                });
            });

            const now = new Date().getTime();
            setAnswer({
                id: '',
                uid: user.uid,
                questionID: question.id,
                body,
                createdAt: new Timestamp(now / 1000, now % 1000),
            });
        },
        [body],
    );

    return (
        <Layout>
            <div className="p-6">
                <div className="flex flex-col items-center p-4">
                    {question && (
                        <>
                            <Card body={question.body} />

                            <section className="w-full text-center mt-4">
                                <h2 className="h4">回答</h2>
                                {answer === null ? (
                                    <form onSubmit={onSubmit}>
                                        <textarea
                                            className="p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                                            placeholder="お元気ですか？"
                                            rows={6}
                                            value={body}
                                            onChange={(e) => setBody(e.target.value)}
                                            required
                                        />
                                        <div className="m-3">
                                            {isSending ? (
                                                <Loading />
                                            ) : (
                                                <button
                                                    type="submit"
                                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold
                                py-2 px-4 rounded"
                                                >
                                                    回答する
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                ) : (
                                    <Card body={answer.body} />
                                )}
                            </section>
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default QuestionPage;
