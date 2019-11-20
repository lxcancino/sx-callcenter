import { Injectable } from '@angular/core';

import { MatDialog } from '@angular/material';
import { SelectorProductoComponent } from '../selector-producto/selector-producto.component';

@Injectable({
  providedIn: 'root'
})
export class ProductosUiService {
  constructor(private dialog: MatDialog) {}

  openSelector() {
    this.dialog.open(SelectorProductoComponent, {});
  }

  
}
