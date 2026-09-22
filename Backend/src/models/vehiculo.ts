export interface Vehiculo {
    id: number;
    placa: string;
    marca?: string;
    modelo?: string;
    anio?: number;
    capacidad_carga?: number;
    estado?: string;
}
