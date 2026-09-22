export class ValidationError extends Error {
    public readonly statusCode = 400;

    constructor(public readonly detalles: string[]) {
        super(`datos invalidos: ${detalles.join(', ')}`);
        this.name = 'ValidationError';
    }
}
