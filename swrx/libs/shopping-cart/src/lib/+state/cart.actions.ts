import { createAction, props } from '@ngrx/store';
import { CartItem } from './cart.models';
import {
  Cliente,
  Pedido,
  TipoDePedido,
  FormaDePago,
  InstruccionDeEnvio,
  Socio
} from '@swrx/core-model';

export const addCartItem = createAction('[ShoppingCartPage] Add CartItem');
export const addCartItemSuccess = createAction(
  '[ShoppingCartPage] Add CartItem success',
  props<{ item: CartItem }>()
);
export const deleteItem = createAction(
  '[CartListComponent] Delete item',
  props<{ item: Partial<CartItem> }>()
);
export const editItem = createAction(
  '[CartListComponent] Edit CartItem',
  props<{ item: CartItem; index: number }>()
);
export const editItemSuccess = createAction(
  '[CartEffects] Edit CartItem Success',
  props<{ item: Partial<CartItem> }>()
);

// Modificaciion de cliente
export const cambiarCliente = createAction(
  '[ShoppingCartPage] Cambiar cliente'
);
export const cambiarClienteError = createAction(
  '[ShoppingCartPage] Cambiar cliente error',
  props<{ error: any }>()
);
export const cambiarClienteSuccess = createAction(
  '[ShoppigCartPage] Cambiar cliente success',
  props<{ cliente: Partial<Cliente> }>()
);

export const cambiarNombre = createAction(
  '[ShoppingCartPage] Cambiar nombre de cliente'
);
export const cambiarNombreSuccess = createAction(
  '[ShoppingCart Effects] Cambiar nombre de cliente success',
  props<{ nombre: string }>()
);

export const cambiarTipo = createAction(
  '[ShoppingCartPage] Cambiar Tipo de Pedido',
  props<{ tipo: TipoDePedido }>()
);
export const cambiarFormaDePago = createAction(
  '[ShoppingCartPage] Cambiar Forma de Pago',
  props<{ formaDePago: FormaDePago }>()
);
export const cambiarUsoDeCfdi = createAction(
  '[ShoppingCartPage] Cambiar Uso de CFDI',
  props<{ clave: string }>()
);
export const cambiarCfdiMail = createAction(
  '[ShoppingCartPage] Cambiar CFDI mail',
  props<{ email: string }>()
);
export const cambiarSucursal = createAction(
  '[ShoppingCartPage] Cambiar Sucursal',
  props<{ sucursal: string }>()
);
export const cambiarComprador = createAction(
  '[ShoppingCartPage] Cambiar Comprador',
  props<{ comprador: string }>()
);
export const cambiarComentario = createAction(
  '[ShoppingCartPage] Cambiar comentario',
  props<{ comentario: string }>()
);
export const assignarDescuentoEspecial = createAction(
  '[CartFacade] Asignar descuento especial'
);
export const assignarDescuentoEspecialSuccess = createAction(
  '[CartEffects] Asignar descuento especial success',
  props<{ descuentoEspecial: number }>()
);
export const recalcularPartidas = createAction(
  '[ShoppingCart Effects] Recalcular Partidas'
);
export const startCheckout = createAction(
  '[ShoppingCartPage] Start Checkout',
  props<{ user: any }>()
);

export const loadPedidoSucces = createAction(
  '[CartEffects] Load pedido success',
  props<{ pedido: Pedido }>()
);

export const cleanShoppingCart = createAction(
  '[NewCartGuard] Clea shopping cart state'
);

export const validarPedido = createAction('[CartEffects] Validar Pedido');

export const registrarEnvio = createAction('[CartEffects] Registrar envio');
export const registrarEnvioSuccess = createAction(
  '[CartEffects] Registrar envio success',
  props<{ envio: InstruccionDeEnvio }>()
);

export const cancelarEnvio = createAction('[CartEffects] Cancelar envio');

export const mostrarDescuentos = createAction(
  '[CartEffects] Mostrar Descuentos'
);

export const iniciarCierreDePedido = createAction(
  '[ShoppingCartPage] Solicitar cierre de pedido',
  props<{ pedido: Partial<Pedido> }>()
);

export const asignarSocio = createAction(
  '[ShoppingCartFacade] Asignar socio',
  props<{ socio: Socio }>()
);

export const agregarManiobra = createAction(
  '[ShoppingCartFacade] Agregar maniobra'
);
