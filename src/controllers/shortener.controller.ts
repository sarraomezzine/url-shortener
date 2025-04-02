import { Request, RequestHandler, Response } from "express";
import { createShortUrl, getOriginUrl } from "../services/shortener.service";
import { OriginUrlNotFoundError } from "../exceptions/OriginUrlNotFoundError";

export const encodeUrl: RequestHandler = (req: Request, res: Response) => {
    const { originUrl } = req.body;
    // Create a short URL and send the response
    const shortUrl = createShortUrl(originUrl);
    res.json({ shortUrl });
};

export const decodeUrl: RequestHandler = (req: Request, res: Response): void => {
    const { shortUrl } = req.query;
    if (!shortUrl){
        res.status(404).json({ error: 'shortUrl not found' });
    }
    try {
        const originUrl = getOriginUrl(shortUrl as string);
        res.json({ originUrl });
    } catch (error) {
        if (error instanceof OriginUrlNotFoundError) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Internal server error" });
        }
    }
};