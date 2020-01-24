import { Direccion } from '@swrx/core-model';

export interface Transporte {
  id?: string;
  nombre: string;
  direccion: Direccion;
}
