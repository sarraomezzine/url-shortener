import dotenv from "dotenv";
dotenv.config();

interface Config {
    port: number;
    baseShortUrl: string;
    shortCodeLength: number;
}

const config: Config = {
    port: parseInt(process.env.PORT || '3000', 10),
    baseShortUrl: process.env.BASE_SHORT_URL || 'http://short.est',
    shortCodeLength: parseInt(process.env.SHORT_CODE_LENGTH || '6', 10),
};

export default config;