import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

export const Layout: React.FC = ({ children }) => {
    const title = 'My質問回答サービス';
    const description = '質問と回答を行えるサービスです。';

    return (
        <div>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{title}</title>
                <meta name="description" key="description" content={description} />
                <meta property="og:title" key="ogTitle" content={title} />
                <meta property="og:site_name" key="ogSiteName" content={title} />
                <meta property="og:description" key="ogDescription" content={description} />
            </Head>
            <nav
                className="flex items-center justify-between flex-wrap mb-4 p-2"
                style={{ backgroundColor: '#e3f2fd' }}
            >
                <div className="mr-auto">
                    <Link href="/">
                        <a className="navbar-brand">Navbar</a>
                    </Link>
                </div>
                <form action="" className="flex">
                    <button
                        className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                        type="submit"
                    >
                        Search
                    </button>
                </form>
            </nav>
            <main className="container">{children}</main>
        </div>
    );
};
