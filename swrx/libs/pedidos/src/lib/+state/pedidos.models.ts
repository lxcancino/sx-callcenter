import { Pedido } from '@swrx/core-model';

/**
 * Interface for the 'Pedidos' data
 */
export interface PedidosEntity extends Pedido {
  tempo?: string;
}
