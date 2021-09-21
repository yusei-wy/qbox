import Head from 'next/head';
import Link from 'next/link';
import { useAuthentication } from '@/hooks/authentication';

const SecondPage: React.FC = () => {
    const { user } = useAuthentication();

    return (
        <div>
            <Head>
                <title>Second page</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <p>{user?.uid || '未ログイン'}</p>
            <Link href="/">
                <a>Go back</a>
            </Link>
        </div>
    );
};

export default SecondPage;
