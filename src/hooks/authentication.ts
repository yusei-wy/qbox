import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { collection, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import { atom, useRecoilState } from 'recoil';

import { User } from '@/models/user';

const userState = atom<User>({
    key: 'user',
    default: null,
});

export const useAuthentication = () => {
    const [user, setUser] = useRecoilState(userState);

    // 認証処理は１度だけでいい
    useEffect(() => {
        if (user !== null) {
            return;
        }
        const auth = getAuth();

        console.log('Start useEffect');

        signInAnonymously(auth).catch((error) => {
            // Handle errors here.
        });

        onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                const loginUser: User = {
                    uid: firebaseUser.uid,
                    isAnnymouse: firebaseUser.isAnonymous,
                    name: '',
                };
                setUser(loginUser);
                createUserIfNotFound(loginUser);
            } else {
                // User is signed out.
                setUser(null);
            }
        });
    }, []);

    return { user };
};

const createUserIfNotFound = async (user: User) => {
    const db = getFirestore();
    const usersCollection = collection(db, 'users');
    const userRef = doc(usersCollection, user.uid);
    const document = await getDoc(userRef);
    if (document.exists()) {
        // 書き込みのほうが高い
        return;
    }

    await setDoc(userRef, {
        name: 'taro' + new Date().getTime(),
    });
};
