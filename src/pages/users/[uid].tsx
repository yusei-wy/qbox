import { addDoc, collection, doc, getDoc, getFirestore, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect } from 'react';
import { useState } from 'react';

import { Layout } from '@/components/layout';
import { Loading } from '@/components/loading';
import { Toast } from '@/components/toast';
import { useAuthentication } from '@/hooks/authentication';
import { User } from '@/models/user';

type Query = {
    uid: string;
};

const UserShow: React.FC = () => {
    const { user: currentUser } = useAuthentication();
    const [user, setUser] = useState<User>(null);
    const [body, setBody] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isShowToast, setIsShowToast] = useState(false);
    const router = useRouter();
    const query = router.query as Query;

    useEffect(() => {
        (async () => {
            if (!query.uid) {
                return;
            }

            const db = getFirestore();
            const ref = doc(collection(db, 'users'), query.uid);
            const userDoc = await getDoc(ref);

            if (!userDoc.exists()) {
                console.log('returned');
                return;
            }

            const gotUser = userDoc.data() as User;
            gotUser.uid = userDoc.id;
            setUser(gotUser);
        })();
    }, [query.uid]);

    const onSubmit = useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            setIsSending(true);

            const db = getFirestore();
            await addDoc(collection(db, 'questions'), {
                senderUID: currentUser.uid,
                receiverUID: user.uid,
                body,
                isReplied: false,
                createdAt: serverTimestamp(),
            });

            setIsSending(false);
            setBody('');
            setIsShowToast(true);
            setTimeout(() => {
                setIsShowToast(false);
            }, 3000);
        },
        [body],
    );

    return (
        <Layout>
            {user && (
                <div className="text-center">
                    <h1 className="h4">{user.name}さんのページ</h1>
                    <div className="m-6">{user.name}さんに質問しよ！</div>
                </div>
            )}
            <div className="flex flex-wrap justify-center mb-4">
                <form className="flex flex-col align-center jusitfy-center w-8/12" onSubmit={onSubmit}>
                    <textarea
                        className="p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                        placeholder="お元気ですか？"
                        rows={6}
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        required
                    />
                    <div className="m-4 text-center">
                        {isSending ? (
                            <Loading />
                        ) : (
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold
                                py-2 px-4 rounded"
                            >
                                質問を送信する
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {isShowToast && <Toast message="質問を送信しました" />}
        </Layout>
    );
};

export default UserShow;
