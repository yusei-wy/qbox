import React from 'react';

export const Layout: React.FC = ({ children }) => {
    return (
        <div>
            <nav
                className="flex items-center justify-between flex-wrap mb-4 p-2"
                style={{ backgroundColor: '#e3f2fd' }}
            >
                <div className="mr-auto">
                    <a href="#" className="navbar-brand">
                        Navbar
                    </a>
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
