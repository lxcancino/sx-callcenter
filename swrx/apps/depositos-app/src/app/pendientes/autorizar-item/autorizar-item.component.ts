import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import * as uuid from 'uuid';

@Component({
  selector: 'swrx-autorizar-item',
  templateUrl: './autorizar-item.component.html',
  styleUrls: ['./autorizar-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutorizarItemComponent implements OnInit {
  control = new FormControl();
  transaccion: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AutorizarItemComponent>
  ) {
    this.transaccion = data.transaccion;
  }

  ngOnInit() {}

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
