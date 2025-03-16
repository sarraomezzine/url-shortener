import { Router } from 'express';
import { encodeEndpoint, decodeEndpoint } from '../controllers/urlShorten.controller';

const router = Router();

/**
 * @swagger
 * /encode:
 *   post:
 *     summary: Encodes a URL to a shortened URL
 *     tags: [URL Shortener]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - longUrl
 *             properties:
 *               longUrl:
 *                 type: string
 *                 format: uri
 *                 example: "https://codesubmit.io/library/react"
 *     responses:
 *       200:
 *         description: Successfully shortened the URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shortUrl:
 *                   type: string
 *                   example: "http://short.ly/abc123"
 *       400:
 *         description: Invalid URL input
 */
router.post('/encode', encodeEndpoint);

/**
 * @swagger
 * /decode/{shortUrl}:
 *   get:
 *     summary: Decodes a shortened URL to its original URL
 *     description: Takes a short URL and returns the original long URL.
 *     parameters:
 *       - in: path
 *         name: shortUrl
 *         required: true
 *         schema:
 *           type: string
 *         description: The short URL to be decoded.
 *     responses:
 *       200:
 *         description: The original long URL.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 longUrl:
 *                   type: string
 *                   example: https://www.example.com
 */
router.get('/decode/:shortUrl', decodeEndpoint);

export default router;