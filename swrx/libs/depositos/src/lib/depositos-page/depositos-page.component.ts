import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DepositoService } from '../services/deposito.service';
import { Deposito } from '../+state/depositos.models';
import { Observable, Subject } from 'rxjs';
import { MatDialog } from '@angular/material';
import { DepositoEditComponent } from '../deposito-edit/deposito-edit.component';

import { AngularFireAuth } from '@angular/fire/auth';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'swrx-depositos-page',
  templateUrl: './depositos-page.component.html',
  styleUrls: ['./depositos-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepositosPageComponent implements OnInit {
  depositos$: Observable<Deposito[]>;
  user: any;
  destroy$ = new Subject<boolean>();
  constructor(
    private service: DepositoService,
    private dialog: MatDialog,
    private firebaseAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.reload();
    this.firebaseAuth.user.pipe(takeUntil(this.destroy$)).subscribe(usr => {
      if (usr) {
        const { displayName, email } = usr;
        this.user = { displayName, email };
      } else {
        this.user = null;
      }
    });
  }

  onCreate(event: Deposito) {
    event.createUser = this.user.displayName || 'tempox';
    event.updateUser = this.user.displayName || 'tempox';
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
          res.updateUser = this.user.displayName || 'tempox';
          this.service.update(res);
        }
      });
  }

  reload() {
    this.depositos$ = this.service.fetchDepositos();
  }
}
