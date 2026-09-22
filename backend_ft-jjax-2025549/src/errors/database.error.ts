export class DatabaseError extends Error {
    public readonly statusCode = 500;

    constructor(mensaje = 'error al consultar la base de datos', public readonly original?: unknown) {
        super(mensaje);
        this.name = 'DatabaseError';
    }
}
