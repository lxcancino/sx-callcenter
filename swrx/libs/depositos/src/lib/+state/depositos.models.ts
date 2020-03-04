import { Cliente } from '@swrx/core-model';
export interface Deposito {
  id?: string;
  folio?: number;
  sucursal?: string;
  cliente: Partial<Cliente>;
  nombre: string;
  rfc: string;
  banco: any;
  cuenta: any;
  fecha: string;
  fechaDeposito: string;
  transferencia: boolean;
  importes?: DepositoImportes;
  total: number;
  autorizacion?: any;
  rechazo?: any;
  estado: 'PENDIENTE' | 'AUTORIZADO' | 'RECHAZADO';
  vendedor: string;
  cerrado: boolean;
  referencia?: string;
  createUser?: string;
  updateUser?: string;
}

/**
 * Interface for the 'Depositos' data
 */
export interface DepositosEntity {
  id?: string; // Primary ID: string;
  sucursal?: string;
  cliente: any;
  nombre: string;
  rfc: string;
  banco: any;
  cuenta: any;
  fecha: string;
  fechaDeposito: string;
  transferencia: boolean;
  importes?: DepositoImportes;
  total: number;
  autorizacion?: any;
}

export interface DepositoImportes {
  efectivo: number;
  cheque: number;
  tarjeta: number;
}
