import { FormaDePago, Pedido, TipoDePedido } from 'src/app/models';

export function buildNewPedido(): Partial<Pedido> {
  return {
    fecha: new Date().toISOString(),
    sucursal: 'CF5FEBRERO',
    cliente: {
      id: '402880fc5e4ec411015e4ecc5dfc0554',
      rfc: 'XAXX010101000',
      nombre: 'MOSTRADOR',
      permiteCheque: false,
      activo: true,
    },
    nombre: 'MOSTRADOR',
    tipo: TipoDePedido.CONTADO,
    formaDePago: FormaDePago.EFECTIVO,
    envio: null,
    comprador: null,
  };
}
