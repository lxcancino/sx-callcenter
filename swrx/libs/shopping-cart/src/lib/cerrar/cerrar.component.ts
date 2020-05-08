import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Pedido } from '@swrx/core-model';
import { CartFacade } from '../+state/cart.facade';
import { Deposito } from '@swrx/depositos';

@Component({
  selector: 'swrx-cerrar',
  templateUrl: './cerrar.component.html',
  styleUrls: ['./cerrar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CerrarComponent implements OnInit {
  pedido: Partial<Pedido>;
  deposito: Deposito;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<CerrarComponent>,
    public facade: CartFacade
  ) {
    this.pedido = data.pedido;
    this.deposito = data.deposito;
  }

  ngOnInit() {
    console.log('Deposito: ', this.deposito);
  }

  onSubmit() {
    this.dialogRef.close(this.pedido);
  }

  isDisabled(autorizciones, deposito: Deposito) {
    if (autorizciones) {
      return true;
    } else if (deposito && !deposito.autorizacion) {
      return true;
    } else {
      return false;
    }
  }

  requiereDeposito() {
    if (!this.deposito) {
      if (
        this.pedido.formaDePago === 'TRANSFERENCIA' ||
        this.pedido.formaDePago.startsWith('DEPOSITO')
      ) {
        return true;
      }
    }
    return false;
  }
}
