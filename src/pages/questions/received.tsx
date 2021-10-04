import dayjs from 'dayjs';
import {
    collection,
    DocumentData,
    getDocs,
    getFirestore,
    limit,
    orderBy,
    query,
    QuerySnapshot,
    startAfter,
    where,
} from 'firebase/firestore';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Card } from '@/components/card';
import { Layout } from '@/components/layout';
import { useAuthentication } from '@/hooks/authentication';
import { Question } from '@/models/question';
import { merge } from '@/utils/array';

const RecdeivedPage: React.FC = () => {
    const { user } = useAuthentication();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isPaginationFinished, setIsPaginationFinished] = useState(false);
    const scrollCollectionRef = useRef<HTMLDivElement>(null);

    const createBaseQuery = () => {
        const db = getFirestore();
        return query(
            collection(db, 'questions'),
            where('receiverUID', '==', user.uid),
            orderBy('createdAt', 'desc'),
            limit(10),
        );
    };

    const appendQuestions = (snapshot: QuerySnapshot<DocumentData>) => {
        const gotQuestions = snapshot.docs.map((doc) => {
            const question = doc.data() as Question;
            question.id = doc.id;
            return question;
        });
        setQuestions(merge(questions, gotQuestions, (b, s) => b.id === s.id));
    };

    const loadQuestions = async () => {
        const snapshot = await getDocs(createBaseQuery());
        if (snapshot.empty) {
            setIsPaginationFinished(true);
            return;
        }

        appendQuestions(snapshot);
    };

    const loadNextQuestions = async () => {
        if (questions.length === 0) {
            return;
        }

        const lastQuetion = questions[questions.length - 1];
        const snapshot = await getDocs(query(createBaseQuery(), startAfter(lastQuetion.createdAt)));

        if (snapshot.empty) {
            setIsPaginationFinished(true);
            return;
        }

        appendQuestions(snapshot);
    };

    useEffect(() => {
        if (!process.browser || user === null) {
            return;
        }

        loadQuestions();
    }, [process.browser, user]);

    const onScroll = useCallback(() => {
        if (isPaginationFinished) {
            return;
        }

        const container = scrollCollectionRef.current;
        if (container === null) {
            return;
        }

        const rect = container.getBoundingClientRect();
        if (rect.top + rect.height > window.innerHeight) {
            return;
        }

        loadNextQuestions();
    }, [questions, isPaginationFinished]);

    useEffect(() => {
        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, [questions, scrollCollectionRef.current, isPaginationFinished]);

    return (
        <Layout>
            <div className="p-6">
                <h1 className="h4">受け取った質問一覧</h1>
                <div className="flex flex-col items-center p-4" ref={scrollCollectionRef}>
                    {questions.map((q) => (
                        <Card
                            key={q.id}
                            title=""
                            body={q.body}
                            timestamp={dayjs(q.createdAt.toDate()).format('YYYY/MM/DD HH:mm')}
                        />
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default RecdeivedPage;
