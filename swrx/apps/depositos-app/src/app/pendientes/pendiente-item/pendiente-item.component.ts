import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { Deposito } from '@swrx/depositos';

import * as moment from 'moment';

@Component({
  selector: 'swrx-pendiente-item',
  templateUrl: './pendiente-item.component.html',
  styleUrls: ['./pendiente-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PendienteItemComponent implements OnInit {
  @Input() item: Deposito;
  @Input() even: boolean;
  @Output() autorizar = new EventEmitter();
  @Output() rechazar = new EventEmitter();
  @Output() eliminar = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  fromNow(time: any) {
    return moment(time).fromNow(false);
  }

  minutesFromNow(time: any) {
    const a = moment();
    const b = moment(time);
    const diff = a.diff(b, 'minutes');
    return diff;
  }

  getWarningClass(time: any) {
    const minutes = this.minutesFromNow(time);
    if (minutes < 10) {
      return { 'valid-span': true };
    } else if (minutes < 120) {
      return { 'warning-span': true };
    } else {
      return { 'danger-span': true };
    }
  }
}
