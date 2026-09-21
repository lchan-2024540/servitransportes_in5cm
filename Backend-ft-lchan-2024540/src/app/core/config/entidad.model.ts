export type TipoCampo = 'text' | 'number' | 'date' | 'select' | 'email' | 'tel';
export type Rol = 'admin' | 'conductor';

export interface CampoEntidad {
    key: string;
    etiqueta: string;
    tipo: TipoCampo;
    requerido?: boolean;
    opciones?: string[];
}

export interface ConfigEntidad {
    clave: string;
    titulo: string;
    tituloSingular: string;
    icono: string;
    campos: CampoEntidad[];
    columnasTabla: string[];
    // roles que pueden ver el listado de esta entidad
    rolesLectura: Rol[];
    // roles que pueden crear, editar o eliminar registros de esta entidad
    rolesEscritura: Rol[];
}
