import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DepositoCreateComponent } from './deposito-create.component';

@Component({
  selector: 'swrx-deposito-create-btn',
  template: `
    <button mat-flat-button color="primary" (click)="show()">
      <fa-icon icon="plus-circle"></fa-icon>
      Nuevo
    </button>
  `,
  styles: []
})
export class DepositoCreateBtnComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  show() {
    this.dialog
      .open(DepositoCreateComponent, {
        data: {},
        width: '750px'
      })
      .afterClosed()
      .subscribe(deposito => {
        if (deposito) {
          console.log('Deposito creado: ', deposito);
        }
      });
  }
}
