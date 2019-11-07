import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
import { DepositosEntity } from '../../+state/depositos.models';

@Component({
  selector: 'swrx-deposito-item',
  templateUrl: './deposito-item.component.html',
  styleUrls: ['./deposito-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepositoItemComponent implements OnInit {
  @Input() deposito: DepositosEntity;
  constructor() {}

  ngOnInit() {}
}
