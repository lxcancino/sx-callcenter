export interface Cliente {
  id: string | number;
  nombre: string;
  clave: string;
  rfc: string;
  cfdiMail?: string;
  credito?: ClienteCredito;
  permiteCheque: boolean;
  folioRFC: number;
  chequeDevuelto: number;
  activo: true;
  juridico: false;
  medios: [];
  direccion: Direccion;
  direcciones?: ClienteDireccion[];
  dateCreated?: string;
  lastUpdated?: string;
  telefonos?: string | number;
  createUser?: string;
  updateUser?: string;
}

export interface ClienteCredito {
  descuentoFijo: number;
  postfechado: boolean;
  lineaDeCredito: number;
  plazo: number;
  saldo: number;
  atrasoMaximo: number;
  creditoActivo: boolean;
}

export interface ClienteDireccion {
  id: string;
  nombre: string;
  direccion: Direccion;
}

export interface Direccion {
  calle: string;
  numeroExterior: string;
  numeroInterior?: string;
  codigoPostal: string;
  colonia: string;
  municipio?: string;
  estado: string;
  pais: 'MEXICO' | 'Mexico' | 'México' | 'ESTADOS UNIDOS' | 'CANADA';
  latitud?: string;
  longitud?: string;
}

export function buildDireccionKey(direccion: Direccion) {
  return `${direccion.calle.substring(0, 20)} #${direccion.numeroExterior} CP:${
    direccion.codigoPostal
  }`;
}

export const buildDireccionEmpty = (): Direccion => {
  return {
    calle: null,
    numeroExterior: null,
    codigoPostal: null,
    colonia: null,
    municipio: null,
    estado: null,
    pais: 'MEXICO'
  }
}

export interface Transporte {
  id?: string;
  nombre: string;
  direccion: Direccion;
}
