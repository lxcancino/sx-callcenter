import { TipoDePedido, FormaDePago } from '@swrx/core-model';
import { CartItem } from './cart.models';

import round from 'lodash/round';
import sumBy from 'lodash/sumBy';

export function generarCargoPorTarjeta(
  items: CartItem[],
  tipo: TipoDePedido,
  fp: FormaDePago
): CartItem {
  if (tipo !== TipoDePedido.CONTADO) {
    return null;
  }
  const netos = items.filter(item => item.modoVenta === 'N');
  if (netos.length > 0) {
    const importeNeto = round(sumBy(netos, 'importe'), 2);
    const cargo = fp === FormaDePago.TARJETA_CRE ? 0.02 : 0.01;
    const precio = round(importeNeto * cargo, 2);
    const importe = precio;
    const subtotal = importe;
    const impuesto = round(importe * 0.016, 2);
    const total = subtotal + impuesto;
    return {
      id: '402880fc5e4ec411015e4ecdb4bb06a0',
      cantidad: 1,
      precio,
      importe,
      impuesto,
      subtotal,
      total,
      producto: {
        id: '402880fc5e4ec411015e4ecdb4bb06a0',
        clave: 'MANIOBRA',
        descripcion: 'M A N I O B R A',
        modoVenta: 'N',
        imageUrl: 'assets/images/1273567240.jpg',
        precioCredito: 0.0,
        precioContado: precio
      },
      clave: 'MANIOBRA',
      descripcion: 'M A N I O B R A',
      kilos: 0,
      gramos: 0,
      unidad: 'PZA',
      modoVenta: 'N',
      presentacion: 'ND',
      nacional: true,
      descuento: 0.0,
      descuentoImporte: 0.0,
      impuestoTasa: 0.16,
      precioOriginal: 0.0,
      precioLista: 0.0,
      descuentoOriginal: 0
    };
  } else {
    return null;
  }
}
