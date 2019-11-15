import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';

import { Deposito } from '../../+state/depositos.models';

@Component({
  selector: 'swrx-deposito-item',
  templateUrl: './deposito-item.component.html',
  styleUrls: ['./deposito-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepositoItemComponent implements OnInit {
  @Input() deposito: Deposito;
  constructor() {}

  ngOnInit() {}
}
