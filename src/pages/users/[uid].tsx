import { collection, doc, getDoc, getFirestore } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useState } from 'react';

import { User } from '@/models/user';

type Query = {
    uid: string;
};

const UserShow: React.FC = () => {
    const [user, setUser] = useState<User>(null);
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

    return <div>{user ? user.name : 'ロード中...'}</div>;
};

export default UserShow;
