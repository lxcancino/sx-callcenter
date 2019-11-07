import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DepositoService } from '../services/deposito.service';
import { DepositosEntity } from '../+state/depositos.models';
import { Observable } from 'rxjs';

@Component({
  selector: 'swrx-depositos-page',
  templateUrl: './depositos-page.component.html',
  styleUrls: ['./depositos-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepositosPageComponent implements OnInit {
  depositos$: Observable<DepositosEntity[]>;
  constructor(private service: DepositoService) {}

  ngOnInit() {}

  onCreate(event: DepositosEntity) {
    event.sucursal = '5FEBRERO';
    this.service.save(event);
  }

  reload() {
    this.depositos$ = this.service.fetchDepositos();
  }
}
