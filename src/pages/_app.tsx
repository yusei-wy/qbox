import '../styles/globals.css';
import '@/lib/firebase';
import { AppProps } from 'next/app';
import React from 'react';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
    return <Component {...pageProps} />;
};

export default MyApp;
