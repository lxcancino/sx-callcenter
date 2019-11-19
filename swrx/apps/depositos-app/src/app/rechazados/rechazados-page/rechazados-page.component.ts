import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Observable } from 'rxjs';

import { Deposito, DepositoService } from '@swrx/depositos';

@Component({
  selector: 'swrx-rechazados-page',
  templateUrl: './rechazados-page.component.html',
  styleUrls: ['./rechazados-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RechazadosPageComponent implements OnInit {
  depositos$: Observable<Deposito[]>;

  constructor(private service: DepositoService) {}

  ngOnInit() {
    this.depositos$ = this.service.fetchRechazados();
  }
}
