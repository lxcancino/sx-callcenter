import { TipoDePedido, FormaDePago } from '@swrx/core-model';
import { CartItem } from './cart.models';

import round from 'lodash/round';
import sumBy from 'lodash/sumBy';

import uuidv4 from 'uuid/v4';

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
    console.log('Calculando maniobra para: ', netos);
    const importeNeto = round(sumBy(netos, 'subtotal'), 2);
    const cargo = fp === FormaDePago.TARJETA_CRE ? 0.02 : 0.01;
    const precio = round(importeNeto * cargo, 2);
    const importe = precio;
    const subtotal = importe;
    const impuesto = round(importe * 0.16, 2);
    const total = subtotal + impuesto;
    return {
      id: uuidv4(),
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

export function generarCargoPorCorte(items: CartItem[]): CartItem | null {
  const found = items.filter(item => item.corte);
  if (found && found.length > 0) {
    const cortes = found.map(item => item.corte);
    const importeNeto = sumBy(cortes, item => item.cantidad * item.precio);
    const precio = round(importeNeto, 2);
    const importe = precio;
    const subtotal = importe;
    if (subtotal <= 0) {
      return null;
    }
    const impuesto = round(importe * 0.16, 2);
    const total = subtotal + impuesto;
    return {
      id: uuidv4(),
      cantidad: 1,
      precio: importe,
      importe,
      impuesto,
      subtotal,
      total,
      producto: {
        id: '402880fc5e4ec411015e4ecc6cc60571',
        clave: 'CORTE',
        descripcion: 'CORTE',
        modoVenta: 'N',
        precioCredito: precio,
        precioContado: precio
      },
      clave: 'CORTE',
      descripcion: 'CORTE',
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

export function generarCargoPorFlete(): CartItem {
  const precio = 0.0;
  return {
    id: uuidv4(),
    cantidad: 1,
    precio,
    importe: 0.0,
    impuesto: 0.0,
    subtotal: 0.0,
    total: 0.0,
    producto: {
      id: '402880fc5e4ec411015e4ecdb4bb06a0',
      clave: 'MANIOBRAF',
      descripcion: 'M A N I O B R A F',
      modoVenta: 'N',
      imageUrl: 'assets/images/1273567240.jpg',
      precioCredito: precio,
      precioContado: precio
    },
    clave: 'MANIOBRAF',
    descripcion: 'M A N I O B R A F',
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
}
