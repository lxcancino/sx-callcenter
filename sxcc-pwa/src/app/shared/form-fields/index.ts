import { FormaDePagoComponent } from './forma-de-pago/forma-de-pago.component';
import { SucursalComponent } from './sucursal/sucursal.component';
import { TipoDePedidoComponent } from './tipo-de-pedido/tipo-de-pedido-field.component';
import { TransporteFieldComponent } from './transporte-field/transporte-field.component';

export const FIELDS = [
  FormaDePagoComponent,
  TipoDePedidoComponent,
  SucursalComponent,
  TransporteFieldComponent,
];

export * from './forma-de-pago/forma-de-pago.component';
export * from './tipo-de-pedido/tipo-de-pedido-field.component';
export * from './sucursal/sucursal.component';
export * from './transporte-field/transporte-field.component';
