import { generateShortCode } from '../utils/shortener.util';
import config from '../config';

// Mock the config module
jest.mock('../config', () => ({
    __esModule: true,
    default: {
        shortCodeLength: 6,
    },
}));

describe('generateShortCode', () => {
    it('should generate a short code of the correct length', () => {
        const shortCode = generateShortCode();
        expect(shortCode.length).toBe(config.shortCodeLength);
    });

    it('should generate a short code with valid characters', () => {
        const shortCode = generateShortCode();
        const validCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

        for (const char of shortCode) {
            expect(validCharacters).toContain(char);
        }
    });
});