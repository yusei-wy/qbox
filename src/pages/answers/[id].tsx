import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React from 'react';

import { Card } from '@/components/card';
import { Layout } from '@/components/layout';
import { Answer } from '@/models/answer';
import { Question } from '@/models/question';

type Props = {
    answer: Answer;
    question: Question;
};

const AnswerDetailPage: React.VFC<Props> = (props) => {
    const description = getDescription(props.answer);

    return (
        <Layout>
            <Head>
                <meta name="descriptoin" key="description" content={description} />
                <meta property="og:description" key="ogDescription" content={description} />
            </Head>
            <div className="p-6">
                <div className="flex flex-col items-center p-4">
                    <>
                        <Card body={props.question.body} />

                        <section className="w-full text-center mt-4">
                            <h2 className="h4">回答</h2>
                            <Card body={props.answer.body} />
                        </section>
                    </>
                </div>
            </div>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
    const res = await fetch(process.env.API_URL + `/api/answers/${query.id}`);
    const json = (await res.json()) as Props;
    return {
        props: json,
    };
};

export default AnswerDetailPage;

const getDescription = (answer: Answer): string => {
    const body = answer.body.replace(/[ \r\n]g/, '');
    return body.length < 140 ? body : body.substring(0, 140) + '...';
};
