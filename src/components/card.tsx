import Link from 'next/link';
import React from 'react';

type Props = {
    title?: string;
    body: string;
    timestamp?: string;
    image?: string;
    imageAlt?: string;
    link?: string;
};

export const Card: React.FC<Props> = (props) => {
    const cardClass = 'min-w-24 border border-solid border-gray-200 rounded  overflow-hidden mb-4 last:mb-0 w-full';
    const cardContent = () => (
        <>
            {props.image && <img className="w-full" src={props.image} alt={props.imageAlt} />}
            <div className="p-4">
                {props.title && <div className="font-bold text-xl mb-2">{props.title}</div>}
                <p className="text-gray-700 text-base">{props.body}</p>
                {props.timestamp && (
                    <div className="text-gray-400 text-right">
                        <small>
                            <time>{props.timestamp}</time>
                        </small>
                    </div>
                )}
            </div>
        </>
    );

    return props.link ? (
        <Link href={props.link}>
            <a className={cardClass}>{cardContent()}</a>
        </Link>
    ) : (
        <div className={cardClass}>{cardContent()}</div>
    );
};
