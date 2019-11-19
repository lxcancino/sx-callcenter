import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { Deposito } from '../+state/depositos.models';

@Component({
  selector: 'swrx-depositos-list',
  templateUrl: './depositos-list.component.html',
  styleUrls: ['./depositos-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepositosListComponent implements OnInit {
  @Input() depositos: Deposito[] = [];
  @Output() edit = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
