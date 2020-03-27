export interface Cliente {
  id: string;
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
  medios?: any[];
  direccion: Direccion;
  direcciones?: ClienteDireccion[];
  direccionesEntrega?: ClienteDireccion[];
  dateCreated?: string;
  lastUpdated?: string;
  telefonos?: string | number;
  createUser?: string;
  updateUser?: string;
  socios?: Socio[];
}

export interface ClienteCredito {
  descuentoFijo: number;
  postfechado: boolean;
  lineaDeCredito: number;
  plazo: number;
  saldo: number;
  atrasoMaximo: number;
  creditoActivo: boolean;
  usoDeCfdi?: string;
}

export interface ClienteDireccion {
  id?: string;
  nombre: string;
  direccion: Direccion;
  cliente?: Partial<Cliente>;
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
  };
};

export interface Transporte {
  id?: string;
  nombre: string;
  direccion: Direccion;
}

export class User {
  displayName: string;
  email: string;
  uid?: string;
  photoURL?: string;
  emailVerified: boolean;
  phoneNumber?: string;
  isAnonymous?: boolean;

  static fromFirebaseUser(usr: any): User {
    const {
      displayName,
      email,
      uid,
      photoURL,
      emailVerified,
      phoneNumber,
      isAnonymous
    } = usr;
    return {
      displayName,
      email,
      uid,
      photoURL,
      emailVerified,
      phoneNumber,
      isAnonymous
    };
  }
}

export interface Socio {
  id: string;
  clave?: string;
  nombre: string;
  direccion?: string;
  direccionFiscal: Direccion;
}
