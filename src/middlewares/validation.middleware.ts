import { Request, Response, NextFunction, RequestHandler } from 'express';
import config from '../config';

// Validate a URL format
const isValidUrl = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
};

// Validate shortUrl format
const isValidShortUrl = (shortUrl: string): boolean => {
    const shortBaseUrl = config.baseShortUrl;
    if (!shortUrl.startsWith(shortBaseUrl)) {
        return false;
    }
    const shortCode = shortUrl.substring(shortBaseUrl.length + 1);
    if (shortCode.length !== config.shortCodeLength || !/^[a-zA-Z0-9]+$/.test(shortCode)) {
        return false;
    }
    return true;
};

// validation middleware
const validateInput = (
    validationRules: {
        [key: string]: (value: string) => boolean;
    },
    errorMessages: {
        [key: string]: string;
    }
): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const inputData = req.method === 'GET' ? req.query : req.body;

        for (const field in validationRules) {
            if (!inputData[field]) {
                res.status(400).json({ error: `${field} is required` });
                return;
            }

            if (!validationRules[field](inputData[field])) {
                res.status(400).json({ error: errorMessages[field] });
                return;
            }
        }
        // Validation successful.
        next();
    };
};

export { validateInput, isValidUrl, isValidShortUrl };