import request from 'supertest';
import express, { Express } from 'express';
import { generateShortCode } from '../utils/shortener.util';
import { decodeUrl, encodeUrl } from '../controllers/shortener.controller';
import { isValidShortUrl, isValidUrl, validateInput } from '../middlewares/validation.middleware';

// Mock config to ensure consistent test environment
jest.mock('../config', () => ({
    __esModule: true,
    default: {
        baseShortUrl: 'http://test.short',
        shortCodeLength: 6,
    },
}));

// Mock generateShortCode to control the short code generation
jest.mock('../utils/shortener.util', () => ({
    generateShortCode: jest.fn(),
}));

describe('URL Shortener Integration Tests', () => {
    let app: Express;
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.post('/encode', validateInput({ originUrl: isValidUrl }, { originUrl: 'Invalid URL format' }), encodeUrl);
        app.get('/decode', validateInput({ shortUrl: isValidShortUrl }, { shortUrl: 'Invalid short URL format' }), decodeUrl);
        (generateShortCode as jest.Mock).mockClear();
    });

    it('should encode and decode a URL successfully', async () => {
        const originUrl = 'https://www.example.com';
        const shortCode = '123zxc';
        (generateShortCode as jest.Mock).mockReturnValue(shortCode);

        const encodeResponse = await request(app)
            .post('/encode')
            .send({ originUrl });
        expect(encodeResponse.status).toBe(200);
        const shortUrl = encodeResponse.body.shortUrl;

        const decodeResponse = await request(app)
            .get('/decode')
            .query({ shortUrl });
        expect(decodeResponse.status).toBe(200);
        expect(decodeResponse.body.originUrl).toBe(originUrl);
    });

    it('should return 404 for a non-existent short URL', async () => {
        const decodeResponse = await request(app)
            .get('/decode')
            .query({ shortUrl: 'http://test.short/mnbmnb' });
        expect(decodeResponse.status).toBe(404);
        expect(decodeResponse.body.error).toBe('No origin URL found for shortUrl: http://test.short/mnbmnb');
    });

    it('should return 400 if shortUrl is missing', async () => {
        const decodeResponse = await request(app)
            .get('/decode');
        expect(decodeResponse.status).toBe(400);
        expect(decodeResponse.body.error).toBe('shortUrl is required');
    });

    it('should return 400 if originUrl is missing in encode', async () => {
        const encodeResponse = await request(app).post('/encode').send({});

        expect(encodeResponse.status).toBe(400);
        expect(encodeResponse.body.error).toBe('originUrl is required');
    });
});