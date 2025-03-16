import { nanoid } from 'nanoid';

// In-memory storage for URL mappings
const urlMap = new Map<string, string>();
const baseURL = 'http://short.est/';


  // Encode a long URL into a short URL
export function encode(longUrl: string): string {
    if (!longUrl) {
      throw new Error('Long URL is required');
    }

    const shortUrl = baseURL + nanoid(6); // Generate a 6-character unique ID
    urlMap.set(shortUrl, longUrl); // Store the mapping in memory
    return shortUrl;
}

  // Decode a short URL into a long URL
export function decode(shortUrl: string): string {
    const longUrl = urlMap.get(baseURL + shortUrl); // Retrieve the long URL from memory

    if (!longUrl) {
      throw new Error('URL not found');
    }

    return longUrl;
}
