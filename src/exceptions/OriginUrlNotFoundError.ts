export class OriginUrlNotFoundError extends Error {
    statusCode: number;
    constructor(message: string) {
        super(message);
        this.name = 'OriginUrlNotFoundError';
        this.statusCode = 404;
    }
}