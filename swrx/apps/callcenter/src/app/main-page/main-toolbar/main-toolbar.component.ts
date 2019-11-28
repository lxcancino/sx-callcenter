import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { ProductosUiService } from '@swrx/productos';

@Component({
  selector: 'swrx-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainToolbarComponent implements OnInit {
  @Input() title = 'SIIPAPX CALLCENTER';

  @Output() toogle = new EventEmitter();

  constructor(private productosUi: ProductosUiService) {}

  ngOnInit() {}

  showProductos() {
    this.productosUi.openSelector();
  }
}
