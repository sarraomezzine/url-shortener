import request from 'supertest';
import express from 'express';
import { encodeUrl, decodeUrl } from '../controllers/shortener.controller';
import { createShortUrl, getOriginUrl } from '../services/shortener.service';
import { OriginUrlNotFoundError } from '../exceptions/OriginUrlNotFoundError';

// Mock the services
jest.mock('../services/shortener.service');

describe('Shortener Controller', () => {
    const app = express();
    app.use(express.json());
    app.post('/encode', encodeUrl);
    app.get('/decode', decodeUrl);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('encodeUrl', () => {
        it('should return a short URL', async () => {
            const mockOriginUrl = 'https://www.example.com/test/123/abc';
            const mockShortUrl = 'http://short.est/123qwe';
            (createShortUrl as jest.Mock).mockReturnValue(mockShortUrl);

            const response = await request(app)
                .post('/encode')
                .send({ originUrl: mockOriginUrl });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ shortUrl: mockShortUrl });
            expect(createShortUrl).toHaveBeenCalledWith(mockOriginUrl);
        });
    });

    describe('decodeUrl', () => {
        it('should return the original URL', async () => {
            const mockShortUrl = 'http://short.est/123qwe';
            const mockOriginUrl = 'https://www.example.com/test/123/abc';
            (getOriginUrl as jest.Mock).mockReturnValue(mockOriginUrl);

            const response = await request(app)
                .get('/decode')
                .query({ shortUrl: mockShortUrl });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ originUrl: mockOriginUrl });
            expect(getOriginUrl).toHaveBeenCalledWith(mockShortUrl);
        });

        it('should return 404 if shortUrl is not provided', async () => {
            const response = await request(app).get('/decode');

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'shortUrl not found' });
        });

        it('should return 404 if original URL is not found', async () => {
            const mockShortUrl = 'http://short.est/123qwe';
            (getOriginUrl as jest.Mock).mockImplementation(() => {
                throw new OriginUrlNotFoundError('Origin URL not found');
            });

            const response = await request(app)
                .get('/decode')
                .query({ shortUrl: mockShortUrl });

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Origin URL not found' });
            expect(getOriginUrl).toHaveBeenCalledWith(mockShortUrl);
        });

        it('should return 500 for internal server error', async () => {
            const mockShortUrl = 'http://short.est/123qwe';
            (getOriginUrl as jest.Mock).mockImplementation(() => {
                throw new Error('Some internal error');
            });

            const response = await request(app)
                .get('/decode')
                .query({ shortUrl: mockShortUrl });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Internal server error' });
            expect(getOriginUrl).toHaveBeenCalledWith(mockShortUrl);
        });
    });
});