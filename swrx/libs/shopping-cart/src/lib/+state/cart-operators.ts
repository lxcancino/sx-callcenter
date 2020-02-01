import { MonoTypeOperatorFunction, of, Observable, pipe } from 'rxjs';

import { select, Store, ActionCreator } from '@ngrx/store';
import * as CartSelectors from './cart.selectors';
import {
  withLatestFrom,
  concatMap,
  filter,
  mergeMap,
  map
} from 'rxjs/operators';
import { CartState } from './cart.reducer';
import { ofType } from '@ngrx/effects';
import * as CartActions from './cart.actions';
import { CartItem } from './cart.models';

import uuidv4 from 'uuid/v4';

export const demo = (input$: Observable<any>) => {};

/**
 * Utility operator to filter null or undefined elements
 *
 */
export const notNull = () => pipe(filter(input => !!input));

/**
 * Custom rxjs operator to inject the current state in the stream
 * so next operator can use it
 *
 * @param store
 */
export const cartState = (store: Store<CartState>) =>
  pipe(
    concatMap((action: { item: CartItem; index?: number }) =>
      of(action).pipe(
        withLatestFrom(store.pipe(select(CartSelectors.getCartState)))
      )
    )
  );

/**
 * Custom filters operator for actions that
 * should fire recalcular action
 *
 */
export const reactiveCartActions = pipe(
  ofType(
    CartActions.cambiarTipo,
    CartActions.cambiarClienteSuccess,
    CartActions.addCartItemSuccess,
    CartActions.deleteItem,
    CartActions.editItemSuccess,
    CartActions.cambiarFormaDePago,
    CartActions.registrarEnvioSuccess,
    CartActions.cancelarEnvio,
    CartActions.assignarDescuentoEspecialSuccess
    // CartActions.asignarSocio
  )
);

/**
 * Injects the current CartState.items in the current stream
 *
 * @param store
 */
export const selectItems = (store: Store<CartState>) =>
  pipe(withLatestFrom(store.pipe(select(CartSelectors.getCartItems))));

/**
 * Maps a new CartItem
 */
export const newItem = pipe(
  map((source: CartItem) => {
    const target = { ...source, id: uuidv4() };
    if (target.corte && target.corte.cantidad > 0) {
      const { cantidad, precio } = target.corte;
      const importe = cantidad * precio;
      target.importeCortes = importe;
    }
    return target;
  })
);

/**
 * Slice of CartState related to Envio
 * @param store
 */
export const envioState = (store: Store<CartState>) =>
  pipe(
    concatMap(action =>
      of(action).pipe(
        withLatestFrom(store.pipe(select(CartSelectors.getCartState))),
        map(([, state]) => {
          return {
            pedido: state.pedido,
            envio: state.envio,
            cliente: state.cliente,
            socio: state.socio
          };
        })
      )
    )
  );

export const pedidoState = (store: Store<CartState>) =>
  pipe(
    concatMap((action: { user: any }) =>
      of(action).pipe(
        withLatestFrom(store.pipe(select(CartSelectors.getPersistenceState))),
        map(([a, entity]) => {
          return {
            id: entity.id,
            changes: entity,
            user: action.user || 'noUser'
          };
        })
      )
    )
  );

export const decuentosState = (store: Store<CartState>) =>
  pipe(
    concatMap(action =>
      of(action).pipe(
        withLatestFrom(
          store.pipe(select(CartSelectors.getDescuentoPorVolumenImporte)),
          store.pipe(select(CartSelectors.getDescuentoPorVolumen)),
          store.pipe(select(CartSelectors.getTipo)),
          store.pipe(select(CartSelectors.selectFormState))
        ),
        map(([, importe, descuento, tipo, formState]) => {
          return {
            importe,
            descuento,
            tipo,
            formState
          };
        })
      )
    )
  );
