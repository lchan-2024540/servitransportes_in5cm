export class ForbiddenError extends Error {
    public readonly statusCode = 403;

    constructor(message = 'no tienes permisos para realizar esta accion') {
        super(message);
        this.name = 'ForbiddenError';
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
}
