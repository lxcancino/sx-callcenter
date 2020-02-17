import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as ClientesActions from './clientes.actions';
import { Cliente } from '@swrx/core-model';

export const CLIENTES_FEATURE_KEY = 'clientes';

export interface ClientesState extends EntityState<Cliente> {
  selectedId?: string | number; // which Clientes record has been selected
  loading: boolean;
  loaded: boolean; // has the Clientes list been loaded
  error?: string | null; // last none error (if any)
}

export interface ClientesPartialState {
  readonly [CLIENTES_FEATURE_KEY]: ClientesState;
}

export const clientesAdapter: EntityAdapter<Cliente> = createEntityAdapter<
  Cliente
>();

export const initialState: ClientesState = clientesAdapter.getInitialState({
  // set initial required properties
  loading: false,
  loaded: false
});

const clientesReducer = createReducer(
  initialState,
  on(ClientesActions.loadClientes, state => ({
    ...state,
    loaded: false,
    error: null
  })),
  on(ClientesActions.loadClientesSuccess, (state, { clientes }) =>
    clientesAdapter.addAll(clientes, { ...state, loaded: true })
  ),
  on(ClientesActions.loadClientesFailure, (state, { error }) => ({
    ...state,
    error
  })),
  on(ClientesActions.createCliente, state => ({ ...state, loading: true })),
  on(ClientesActions.createClienteFail, (state, { response }) => ({
    ...state,
    loading: false,
    error: response
  })),
  on(ClientesActions.createClienteSuccess, (state, { cliente }) =>
    clientesAdapter.addOne(cliente, { ...state, loading: false })
  )
);

export function reducer(state: ClientesState | undefined, action: Action) {
  return clientesReducer(state, action);
}
