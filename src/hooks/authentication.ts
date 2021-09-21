import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { atom, useRecoilState } from 'recoil';
import { User } from '@/models/user';
import { useEffect } from 'react';

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
                console.log('Set user');
                setUser({
                    uid: firebaseUser.uid,
                    isAnnymouse: firebaseUser.isAnonymous,
                });
            } else {
                // User is signed out.
                setUser(null);
            }
        });
    }, []);

    return { user };
};
