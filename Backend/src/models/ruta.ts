export interface Ruta {
    id: number;
    origen: string;
    destino: string;
    distancia_km?: number;
    tiempo_estimado_horas?: number;
}
