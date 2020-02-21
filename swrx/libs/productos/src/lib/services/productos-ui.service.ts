import { Injectable } from '@angular/core';

import { MatDialog } from '@angular/material';
import { SelectorProductoComponent } from '../selector-producto/selector-producto.component';

import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductosUiService {
  constructor(private dialog: MatDialog) {}

  openSelector() {
    return this.dialog
      .open(SelectorProductoComponent, {})
      .afterClosed()
      .pipe(filter(p => !!p));
  }
}
