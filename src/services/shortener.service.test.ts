import { createShortUrl, getOriginUrl } from '../services/shortener.service';
import { OriginUrlNotFoundError } from '../exceptions/OriginUrlNotFoundError';
import config from '../config';
import { generateShortCode } from '../utils/shortener.util';

// Mock the config module
jest.mock('../config', () => ({
    __esModule: true,
    default: {
        baseShortUrl: 'http://short.url',
        shortCodeLength: 6,
    },
}));

// Mock the generateShortCode utility
jest.mock('../utils/shortener.util', () => ({
    generateShortCode: jest.fn(),
}));

describe('Shortener Service', () => {
    const baseUrl = config.baseShortUrl;

    beforeEach(() => {
        (generateShortCode as jest.Mock).mockClear();
    });

    describe('createShortUrl', () => {
        it('should create a short URL and store it', () => {
            const originUrl = 'https://www.example.com';
            const shortCode = 'abcdef';
            (generateShortCode as jest.Mock).mockReturnValue(shortCode);

            const shortUrl = createShortUrl(originUrl);
            expect(shortUrl).toBe(`${baseUrl}/${shortCode}`);
        });

        it('should generate a new short code on each call', () => {
            const originUrl = 'https://www.example.com';
            (generateShortCode as jest.Mock).mockReturnValueOnce('zxcqwe').mockReturnValueOnce('123456');

            createShortUrl(originUrl);
            createShortUrl(originUrl);

            expect(generateShortCode).toHaveBeenCalledTimes(2);
        });
    });

    describe('getOriginUrl', () => {
        it('should return the original URL for a valid short URL', () => {
            const originUrl = 'https://www.example.com';
            const shortCode = 'asdfgh';
            (generateShortCode as jest.Mock).mockReturnValue(shortCode);
            const shortUrl = createShortUrl(originUrl);

            const retrievedOriginUrl = getOriginUrl(shortUrl);

            expect(retrievedOriginUrl).toBe(originUrl);
        });

        it('should throw OriginUrlNotFoundError for an invalid short URL', () => {
            expect(() => getOriginUrl('http://short.url/invalid')).toThrow(
                OriginUrlNotFoundError
            );
        });
    });
});