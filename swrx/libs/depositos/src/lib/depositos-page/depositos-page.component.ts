import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DepositoService } from '../services/deposito.service';
import { Deposito } from '../+state/depositos.models';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material';
import { DepositoEditComponent } from '../deposito-edit/deposito-edit.component';

@Component({
  selector: 'swrx-depositos-page',
  templateUrl: './depositos-page.component.html',
  styleUrls: ['./depositos-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepositosPageComponent implements OnInit {
  depositos$: Observable<Deposito[]>;
  constructor(private service: DepositoService, private dialog: MatDialog) {}

  ngOnInit() {
    this.reload();
  }

  onCreate(event: Deposito) {
    this.service.save(event);
  }
  onEdit(deposito: Deposito) {
    this.dialog
      .open(DepositoEditComponent, {
        data: { deposito }
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          console.log('Salvando cambios: ', res);
          this.service.update(res);
        }
      });
  }

  reload() {
    this.depositos$ = this.service.fetchDepositos();
  }
}
