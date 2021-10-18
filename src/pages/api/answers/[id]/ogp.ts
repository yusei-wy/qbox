import { createCanvas } from 'canvas';
import { NextApiRequest, NextApiResponse } from 'next';

const ogp = async (req: NextApiRequest, res: NextApiResponse) => {
    const width = 600;
    const height = 315;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#888888';
    ctx.fillRect(0, 0, width, height);

    const buffer = canvas.toBuffer();

    res.writeHead(200, {
        'cotent-type': 'image/png',
        'content-length': buffer.length,
    }).end(buffer, 'binary');
};

export default ogp;
