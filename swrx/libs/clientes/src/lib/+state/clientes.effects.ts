import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';

import { ClientesPartialState } from './clientes.reducer';
import * as ClientesActions from './clientes.actions';
import { ClienteService } from '../services/cliente.service';
import { map, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class ClientesEffects {
  loadClientes$ = createEffect(() =>
    this.dataPersistence.fetch(ClientesActions.loadClientes, {
      run: (
        action: ReturnType<typeof ClientesActions.loadClientes>,
        state: ClientesPartialState
      ) => {
        // Your custom service 'load' logic goes here. For now just return a success action...
        return ClientesActions.loadClientesSuccess({ clientes: [] });
      },

      onError: (
        action: ReturnType<typeof ClientesActions.loadClientes>,
        error
      ) => {
        console.error('Error', error);
        return ClientesActions.loadClientesFailure({ error });
      }
    })
  );

  createCliente$ = createEffect(() =>
    this.dataPersistence.pessimisticUpdate(ClientesActions.createCliente, {
      run: (
        action: ReturnType<typeof ClientesActions.createCliente>,
        state: ClientesPartialState
      ) => {
        return this.service
          .save(action.cliente)
          .pipe(
            map(cliente => ClientesActions.createClienteSuccess({ cliente }))
          );
      },

      onError: (
        action: ReturnType<typeof ClientesActions.createCliente>,
        response
      ) => {
        console.error('Error salvando cliente: ', response);
        return ClientesActions.createClienteFail({ response: response });
      }
    })
  );

  createSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ClientesActions.createClienteSuccess),
        map(action => action.cliente),
        tap(cliente => {
          this.snack.open(
            `Cliente generado exitosamente ${cliente.clave} `,
            'Ok',
            { duration: 3000 }
          );
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private dataPersistence: DataPersistence<ClientesPartialState>,
    private service: ClienteService,
    private snack: MatSnackBar
  ) {}
}
