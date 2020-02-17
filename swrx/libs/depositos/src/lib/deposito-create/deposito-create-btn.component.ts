import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { MatDialog } from '@angular/material';
import { DepositoCreateComponent } from './deposito-create.component';
import { DepositosEntity } from '../+state/depositos.models';

@Component({
  selector: 'swrx-deposito-create-btn',
  template: `
    <button mat-flat-button color="primary" (click)="show()">
      <fa-icon icon="plus-circle"></fa-icon>
      Nuevo
    </button>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepositoCreateBtnComponent implements OnInit {
  @Output() create = new EventEmitter<DepositosEntity>();
  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  show() {
    this.dialog
      .open(DepositoCreateComponent, {
        data: {},
        width: '50%'
      })
      .afterClosed()
      .subscribe(deposito => {
        if (deposito) {
          this.create.emit(deposito);
        }
      });
  }
}
