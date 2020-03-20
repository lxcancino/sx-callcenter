import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import * as uuid from 'uuid';
import { DepositoService } from '@swrx/depositos';

import { of, merge, Subject } from 'rxjs';
import { finalize, delay, tap } from 'rxjs/operators';

@Component({
  selector: 'swrx-autorizar-item',
  templateUrl: './autorizar-item.component.html',
  styleUrls: ['./autorizar-item.component.scss']
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutorizarItemComponent implements OnInit {
  control = new FormControl();
  transaccion: any;

  posibleDuplicadoCallcenter: any = null;
  posibleDuplicadoSiipap: any;
  buscandoDuplicados = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AutorizarItemComponent>,
    private service: DepositoService
  ) {
    this.transaccion = data.transaccion;
  }

  ngOnInit() {
    this.buscarDuplicados();
  }

  private buscarDuplicados() {
    this.buscandoDuplicados = true;
    const obs1$ = this.buscarDuplicadosCallCenter();
    const obs2$ = this.buscarDuplicadoEnSiipap();
    const res$ = merge(obs1$, obs2$).pipe(
      finalize(() => {
        this.buscandoDuplicados = false;
      })
    );
    res$.subscribe(res => {
      console.log('Res: ', res);
    });
  }

  buscarDuplicadosCallCenter() {
    this.posibleDuplicadoCallcenter = null;
    this.posibleDuplicadoSiipap = null;
    return this.service
      .buscarDuplicadoAlAutorizar(
        this.transaccion.total,
        this.transaccion.banco,
        this.transaccion.fechaDeposito
      )
      .pipe(
        delay(2000),
        tap(response => {
          if (Array.isArray(response) && response.length > 0) {
            const found = response[0];
            this.posibleDuplicadoCallcenter = found;
          } else {
            this.posibleDuplicadoCallcenter = undefined;
          }
        })
      );
  }

  buscarDuplicadoEnSiipap() {
    return this.service.buscarPosibleDuplicadoEnSiipap(this.transaccion).pipe(
      tap(sol => {
        if (sol) {
          this.posibleDuplicadoSiipap = sol;
        } else {
          this.posibleDuplicadoSiipap = undefined;
        }
      })
    );
  }

  submit() {
    const autorizacion = {
      user: 'admin',
      referencia: this.control.value || '',
      uuid: uuid.v4(),
      fecha: new Date().toISOString()
    };
    this.dialogRef.close(autorizacion);
  }
}
