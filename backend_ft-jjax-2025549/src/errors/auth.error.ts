export class AuthError extends Error {
    public readonly statusCode = 401;

    constructor(message = 'credenciales invalidas') {
        super(message);
        this.name = 'AuthError';
        Object.setPrototypeOf(this, AuthError.prototype);
    }
}
