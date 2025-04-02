import { Request, Response, NextFunction } from 'express';
import { validateInput, isValidUrl, isValidShortUrl } from './validation.middleware';

// Mock the config module
jest.mock('../config', () => ({
    __esModule: true,
    default: {
        baseShortUrl: 'http://short.url',
        shortCodeLength: 6,
    },
}));

describe('Validation Middleware', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = { body: {}, query: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    describe('isValidUrl', () => {
        it('should return true for valid URLs', () => {
            expect(isValidUrl('https://www.example.com')).toBe(true);
            expect(isValidUrl('http://example.com/path?query=value')).toBe(true);
        });

        it('should return false for invalid URLs', () => {
            expect(isValidUrl('not a url')).toBe(false);
            expect(isValidUrl('test/short')).toBe(false);
        });
    });

    describe('isValidShortUrl', () => {
        it('should return true for valid short URLs', () => {
            expect(isValidShortUrl('http://short.url/abcdef')).toBe(true);
            expect(isValidShortUrl('http://short.url/123456')).toBe(true);
        });

        it('should return false for invalid short URLs', () => {
            expect(isValidShortUrl('https://other.url/abcdef')).toBe(false);
            expect(isValidShortUrl('http://short.url/abcde')).toBe(false);
            expect(isValidShortUrl('http://short.url/abcdefg')).toBe(false);
            expect(isValidShortUrl('http://short.url/')).toBe(false);
        });
    });

    describe('validateInput middleware', () => {
        it('should return 400 for missing input', () => {
            const middleware = validateInput(
                { originUrl: isValidUrl },
                { originUrl: 'Invalid URL format' }
            );

            middleware(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'originUrl is required' });
            expect(next).not.toHaveBeenCalled();
        });
        it('should handle GET requests with query parameters', () => {
            const middleware = validateInput(
                { shortUrl: isValidShortUrl },
                { shortUrl: 'Invalid short URL format' }
            );

            req.method = 'GET';
            req.query = { shortUrl: 'http://short.url/abcdef' };
            middleware(req as Request, res as Response, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });
    });
});