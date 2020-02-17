import { CartState } from './cart.reducer';
import { TipoDeAutorizacion } from '@swrx/core-model';

export function resolveAutorizaciones(state: CartState): string | null {
  const data: string[] = [];
  if (state.descuentoEspecial > 0 && state.pedido) {
    if (!state.pedido.autorizacion) {
      data.push(TipoDeAutorizacion.DESCUENTO.toString());
    }
  }

  const partidas = Object.values(state.items);
  if (partidas.length > 0) {
    const pendientes = partidas
      .map(item => (item.faltante ? item.faltante : 0))
      .reduce((prev, curr) => prev + curr);

    if (pendientes > 0) {
      if (!state.pedido || !state.pedido.autorizacion) {
        data.push(TipoDeAutorizacion.EXISTENCIA.toString());
      }
    }
  }
  return data.join(',');
}
