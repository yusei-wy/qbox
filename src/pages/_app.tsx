import '../styles/globals.css';
import '@/lib/firebase';
import 'dayjs/locale/ja';

import dayjs from 'dayjs';
import { AppProps } from 'next/app';
import React from 'react';
import { RecoilRoot } from 'recoil';

dayjs.locale('ja');

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
    return (
        <RecoilRoot>
            <Component {...pageProps} />
        </RecoilRoot>
    );
};

export default MyApp;
