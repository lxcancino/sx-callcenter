import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import { Deposito, DepositoService } from '@swrx/depositos';

@Component({
  selector: 'swrx-autorizados-page',
  templateUrl: './autorizados-page.component.html',
  styleUrls: ['./autorizados-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutorizadosPageComponent implements OnInit {
  depositos$: Observable<Deposito[]>;

  constructor(private service: DepositoService) { }

  ngOnInit() {
    this.depositos$ = this.service.fetchDepositosByStatus('AUTORIZADO');
  }

}
