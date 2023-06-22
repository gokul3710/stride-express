import { Request, Response } from 'express';
import path  from 'path'

export const cacheImage = (req: Request, res: Response) => {

    const { filename } = req.params;

    const imagePath = path.join(__dirname, '../image', filename);

    // Set cache control headers
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache the image for 1 hour
    res.setHeader('Expires', new Date(Date.now() + 3600000).toUTCString()); // Expires header
    res.sendFile(imagePath);
}