import { Request } from 'express'; 
import { encode, decode } from '../services/urlShorten.service';


export async function encodeEndpoint(req: Request, res, next) {
    try {
      console.log("Request res res :", req);
        console.log("Request body:", req.body);
        const { longUrl } = req.body;
        
        if (!longUrl) {
            return res.status(400).json({ error: 'Long URL is required' });
        }

        const shortUrl = encode(longUrl);
        res.json({ shortUrl });

    } catch (error) {
        console.error("Error occurred when shortening the URL:", error);
        next(error);
    }
}

export async function decodeEndpoint(req:Request, res, next) {
    try {
        const { shortUrl } = req.params;
        const longUrl = decode(shortUrl);

        if (longUrl) {
            res.json({ longUrl });
        } else {
            res.status(404).json({ error: 'URL not found' });
        }
    } catch (error) {
        console.error("Error occurred when decoding the URL:", error);
        next(error);
    }
}

export function sum(a:number , b: number) {
    return a + b;
}
  
  


