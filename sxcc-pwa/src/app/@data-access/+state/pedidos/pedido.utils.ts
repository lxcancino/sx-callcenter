import { Cliente, FormaDePago, Pedido, TipoDePedido } from 'src/app/models';

export function buildNewPedido(): Pedido {
  const cliente = getClienteMostrador();
  const { nombre, rfc } = cliente;
  return {
    folio: 0,
    fecha: new Date().toISOString(),
    sucursal: 'CF5FEBRERO',
    moneda: 'MXN',
    tipoDeCambio: 1.0,
    cliente,
    nombre,
    rfc,
    tipo: TipoDePedido.CONTADO,
    formaDePago: FormaDePago.EFECTIVO,
    envio: null,
    comprador: null,
    partidas: [],
    importe: 0.0,
    descuento: 0.0,
    descuentoImporte: 0.0,
    subtotal: 0,
    impuesto: 0,
    total: 0,
    kilos: 0.0,
    status: 'COTIZACION',
    usoDeCfdi: '03',
  };
}

export function getClienteMostrador(): Partial<Cliente> {
  return {
    id: '402880fc5e4ec411015e4ecc5dfc0554',
    rfc: 'XAXX010101000',
    nombre: 'MOSTRADOR',
    permiteCheque: false,
    activo: true,
  };
}
