import { PedidoDet, TipoDePedido } from '@swrx/core-model';
import round from 'lodash/round';

export function clienteMostrador() {
  return {
    id: '402880fc5e4ec411015e4ecc5dfc0554',
    rfc: 'XAXX010101000',
    nombre: 'MOSTRADOR'
  };
}

export const DESCUENTOS = [
  { descuento: 0.0, importe: 100.0 },
  { descuento: 8.0, importe: 1000.0 },
  { descuento: 10.0, importe: 5000.0 },
  { descuento: 12.0, importe: 12000.0 },
  { descuento: 14.0, importe: 21500.0 },
  { descuento: 15.0, importe: 46000.0 },
  { descuento: 16.0, importe: 82000.0 },
  { descuento: 17.0, importe: 150000.0 },
  { descuento: 18.0, importe: 30000000.0 }
];

export function calcularDescuentoPorVolumen(importe: number) {
  const mayores = DESCUENTOS.filter(item => item.importe >= importe);
  if (mayores.length > 0) {
    return mayores[0].descuento;
  } else {
    return 18.0;
  }
}

export function aplicarDescuentos(
  partidas: PedidoDet[],
  tipo: TipoDePedido,
  descuento: number
) {
  const res = partidas.map(item => {
    let rdesc: number;
    if (tipo === TipoDePedido.CREDITO) {
      rdesc = descuento;
    } else {
      rdesc = item.modoVenta === 'B' ? descuento : 0;
    }
    return recalculaPartida(item, tipo, rdesc);
  });
  return res;
}

export function recalculaPartida(
  item: PedidoDet,
  tipo: TipoDePedido,
  descuento: number
): PedidoDet {
  console.log('Recalculando partida:', item);
  console.log('Tipo de pedido: ', tipo);
  console.log('Descuento: ', descuento);
  const { cantidad, precioCredito, precioContado } = item;
  const precio = tipo === TipoDePedido.CREDITO ? precioCredito : precioContado;
  const factor = item.unidad === 'MIL' ? 1000 : 1;
  let importe = (cantidad * precio) / factor;
  importe = round(importe, 2);
  const descuentoImporte = round(importe * (descuento / 100), 2);
  const subtotal = importe - descuentoImporte;
  const impuesto = round(subtotal * 0.16, 2);
  const total = subtotal + impuesto;

  return {
    ...item,
    precio,
    importe,
    descuento,
    descuentoImporte,
    subtotal,
    impuesto,
    total
  };
}
