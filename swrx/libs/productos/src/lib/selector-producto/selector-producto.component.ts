import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'swrx-selector-producto',
  templateUrl: './selector-producto.component.html',
  styleUrls: ['./selector-producto.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectorProductoComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  doSelect() {}
}
