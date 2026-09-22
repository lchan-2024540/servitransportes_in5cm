import { IncomingMessage, ServerResponse } from 'http';

export function enviarJson(res: ServerResponse, statusCode: number, datos: unknown) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end(JSON.stringify(datos));
}


export function leerCuerpo(req: IncomingMessage): Promise<Record<string, unknown>> {
    return new Promise((resolve, reject) => {
        let cuerpo = '';

        req.on('data', (fragmento) => {
            cuerpo += fragmento;
        });

        req.on('end', () => {
            if (!cuerpo) {
                resolve({});
                return;
            }
            try {
                resolve(JSON.parse(cuerpo));
            } catch (error) {
                reject(new Error('el cuerpo de la peticion no es un json valido'));
            }
        });

        req.on('error', reject);
    });
}
