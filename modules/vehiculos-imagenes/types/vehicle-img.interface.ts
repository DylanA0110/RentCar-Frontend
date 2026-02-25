export interface VechilesImagenes {
    id:          string;
    url:         string;
    altText:     string;
    storagePath: null;
    esPrincipal: boolean;
    vehiculo:    Vehiculo;
}

export interface Vehiculo {
    id:           string;
    marca:        string;
    modelo:       string;
    anio:         number;
    placa:        string;
    precioPorDia: string;
    estado:       string;
    activo:       boolean;
}
