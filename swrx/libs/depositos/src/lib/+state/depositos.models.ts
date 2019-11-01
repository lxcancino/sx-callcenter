/**
 * Interface for the 'Depositos' data
 */
export interface DepositosEntity {
  id: number; // Primary ID: string;
}

export interface DepositoDto {
  id?: number;
  nombre: string;
  banco: { id: string; nombre: string; descripcion: string };
  cuentaDeBanco: { id: string; numero: string; descripcion: string };
  fecha: string;
  fechaDeposito: string;
  referencia?: string;
  importes: DepositoImportes;
  total: number;
  comentario?: string;
  sucursal?: string;
  cobro?: string;
  cancelacion?: { fecha: string; comentario: string };
  dateCreated?: string;
  lastUpdated?: string;
  createUser?: string;
  updateUser?: string;
}

export interface DepositoImportes {
  efectivo: number;
  cheque: number;
  transferencia: number;
}
