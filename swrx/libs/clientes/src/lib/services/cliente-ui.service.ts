import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog, MatDialogRef } from '@angular/material';

import { Observable } from 'rxjs';

import { Cliente } from '@swrx/core-model';
import { ClienteSelectorComponent } from '../cliente-selector/cliente-selector.component';

@Injectable({
  providedIn: 'root'
})
export class ClienteUiService {
  constructor(private dialog: MatDialog, private router: Router) {}

  openSelector(): MatDialogRef<any> {
    return this.dialog.open(ClienteSelectorComponent, {
      data: {},
      width: '750px'
    });
  }

  seleccionarCliente(): Observable<Cliente> {
    return this.dialog
      .open(ClienteSelectorComponent, {
        data: {},
        width: '750px'
      })
      .afterClosed();
  }

  lookup() {
    return this.dialog
      .open(ClienteSelectorComponent, {
        data: {},
        width: '750px'
      })
      .afterClosed();
  }
}
