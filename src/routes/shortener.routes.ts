import express from "express";
import { decodeUrl, encodeUrl } from "../controllers/shortener.controller";
import { isValidShortUrl, isValidUrl, validateInput } from "../middlewares/validation.middleware";
import config from "../config";

const router = express.Router();

// Validation rules for encodeUrl
const encodeValidationRules = {
    originUrl: isValidUrl,
};

const encodeErrorMessages = {
    originUrl: 'originUrl is not a valid URL',
};

// Validation rules for decodeUrl
const decodeValidationRules = {
    shortUrl: isValidShortUrl,
};

const decodeErrorMessages = {
    shortUrl: `shortUrl is not a valid URL, it should be ${config.baseShortUrl}, followed ${config.shortCodeLength}-character alphanumeric code`,
};

// Apply the middleware to your routes
router.post("/encode", validateInput(encodeValidationRules, encodeErrorMessages), encodeUrl);
router.get("/decode", validateInput(decodeValidationRules, decodeErrorMessages), decodeUrl);

export default router;
