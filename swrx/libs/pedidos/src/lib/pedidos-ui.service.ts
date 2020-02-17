import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AltPedidoComponent } from './alt-pedido/alt-pedido.component';

@Injectable({
  providedIn: 'root'
})
export class PedidosUiService {
  constructor(private dialog: MatDialog) {}

  consultaRapida(id: string) {
    this.dialog.open(AltPedidoComponent, {});
  }
}
