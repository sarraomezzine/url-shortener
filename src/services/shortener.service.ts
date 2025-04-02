import config from "../config";
import { OriginUrlNotFoundError } from "../exceptions/OriginUrlNotFoundError";
import { generateShortCode } from "../utils/shortener.util";

const urlStore: Record<string, string> = {}; // In-memory storage
const baseUrl = config.baseShortUrl

export const createShortUrl = (originUrl: string): string => {
    let shortCode: string;
    // Ensure unique shortCode
    do {
        shortCode = generateShortCode();
    } while (urlStore.hasOwnProperty(`${baseUrl}/${shortCode}`));

    const shortURL = `${baseUrl}/${shortCode}`;
    urlStore[shortURL] = originUrl;
    return shortURL;
};

export const getOriginUrl = (shortUrl: string): string => {
    const originUrl = urlStore[shortUrl];
    if (!originUrl) {
        throw new OriginUrlNotFoundError(`No origin URL found for shortUrl: ${shortUrl}`);
    }
    return originUrl;
}