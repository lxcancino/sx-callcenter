import { Direccion } from '@swrx/core-model';

export interface Transporte {
  id?: string;
  nombre: string;
  telefono1?: string;
  telefono2?: string;
  telefono3?: string;
  direccion: Direccion;
  sucursal?: string;
}
