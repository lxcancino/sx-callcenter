import { createAction, props } from '@ngrx/store';

import { Cliente } from '@swrx/core-model';

export const loadClientes = createAction('[Clientes] Load Clientes');

export const loadClientesSuccess = createAction(
  '[Clientes] Load Clientes Success',
  props<{ clientes: Cliente[] }>()
);

export const loadClientesFailure = createAction(
  '[Clientes] Load Clientes Failure',
  props<{ error: any }>()
);

export const createCliente = createAction(
  '[Create cliente Componente] Create cliente',
  props<{ cliente: Partial<Cliente> }>()
);
export const createClienteFail = createAction(
  '[Cliente API] Create cliente fail',
  props<{ response: any }>()
);
export const createClienteSuccess = createAction(
  '[Cliente API] Create cliente success',
  props<{ cliente: Cliente }>()
);
