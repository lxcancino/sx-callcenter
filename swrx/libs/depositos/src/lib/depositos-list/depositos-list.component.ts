import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { DepositosEntity } from '../+state/depositos.models';

@Component({
  selector: 'swrx-depositos-list',
  templateUrl: './depositos-list.component.html',
  styleUrls: ['./depositos-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepositosListComponent implements OnInit {
  @Input() depositos: DepositosEntity[] = [];
  constructor() { }

  ngOnInit() {
  }

}
