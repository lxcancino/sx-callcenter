import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';

import { select, Store } from '@ngrx/store';

import * as fromClientes from './clientes.reducer';
import * as ClientesSelectors from './clientes.selectors';
import * as ClientesActions from './clientes.actions';
import { Cliente } from '@swrx/core-model';
import { ClienteCreateComponent } from '../cliente-create/cliente-create.component';
import { ClienteService } from '../services/cliente.service';

@Injectable()
export class ClientesFacade {
  loaded$ = this.store.pipe(select(ClientesSelectors.selectClientesLoaded));
  loading$ = this.store.pipe(select(ClientesSelectors.selectClientesLoading));
  allClientes$ = this.store.pipe(select(ClientesSelectors.getAllClientes));
  selectedClientes$ = this.store.pipe(select(ClientesSelectors.getSelected));

  constructor(
    private store: Store<fromClientes.ClientesPartialState>,
    private dialog: MatDialog,
    private service: ClienteService
  ) {}

  loadAll() {
    this.store.dispatch(ClientesActions.loadClientes());
  }

  createCliente(user :{displayName: string, email: string}) {
    this.dialog
      .open(ClienteCreateComponent, { data: {}, width: '750px' })
      .afterClosed()
      .subscribe(cliente => {
        if (cliente) {
          cliente.createUser = user.displayName;
          cliente.updateUser = user.displayName;
          this.store.dispatch(ClientesActions.createCliente({ cliente }));
        }
      });
  }
}
