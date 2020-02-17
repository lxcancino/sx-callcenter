import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Pedido } from '@swrx/core-model';

@Component({
  selector: 'swrx-cerrar',
  templateUrl: './cerrar.component.html',
  styleUrls: ['./cerrar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CerrarComponent implements OnInit {
  pedido: Partial<Pedido>;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<CerrarComponent>
  ) {
    this.pedido = data.pedido;
  }

  ngOnInit() {}

  onSubmit() {
    this.dialogRef.close(this.pedido);
  }
}
