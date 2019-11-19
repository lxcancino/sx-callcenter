import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
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
  @Output() edit = new EventEmitter();
  constructor() {}

  ngOnInit() {}
}
