export interface Cliente {
  id: string | number;
  nombre: string;
  clave: string;
  rfc: string;
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
  sw2?: string | number;
  createUser?: string;
  updateUser?: string;
}

export interface ClienteCredito {
  id: string | number;
  descuentoFijo: number;
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
  pais: 'MEXICO' | 'ESTADOS UNIDOS' | 'CANADA';
  latitud: string;
  longitud: string;
}

export interface Transporte {
  id?: string;
  nombre: string;
  direccion: Direccion;
}
