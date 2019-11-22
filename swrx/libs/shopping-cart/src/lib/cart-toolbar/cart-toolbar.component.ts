import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { FormGroup } from '@angular/forms';

import { ClienteUiService } from '@swrx/clientes';
import { Cliente } from '@swrx/core-model';

@Component({
  selector: 'swrx-cart-toolbar',
  templateUrl: './cart-toolbar.component.html',
  styleUrls: ['./cart-toolbar.component.scss']
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartToolbarComponent implements OnInit {
  @Input() cartForm: FormGroup;
  @Output() addItem = new EventEmitter();
  constructor(private clienteUi: ClienteUiService) {}

  ngOnInit() {}

  seleccionarCliente() {
    this.clienteUi.seleccionarCliente().subscribe(res => {
      if (res) {
        this.cartForm.get('cliente').setValue(res);
        this.cartForm.get('nombre').setValue(res.nombre);
        this.cartForm.get('rfc').setValue(res.rfc);
      }
    });
  }

  get cliente() {
    return this.cartForm.get('cliente').value;
  }

  get nombre() {
    return this.cartForm.get('nombre').value;
  }
  get rfc() {
    return this.cartForm.get('rfc').value;
  }
}
