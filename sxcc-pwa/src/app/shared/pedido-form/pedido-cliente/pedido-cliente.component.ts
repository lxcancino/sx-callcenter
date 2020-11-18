import { formatCurrency, formatNumber } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ClienteCredito } from '@models';
import { FormatService } from 'src/app/@core/services/format.service';

@Component({
  selector: 'sxcc-pedido-cliente',
  templateUrl: 'pedido-cliente.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidoClienteComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() creditoPanelColor = 'light';

  constructor(private format: FormatService) {}

  ngOnInit() {}

  get saldo() {
    if (this.credito) {
      return this.format.formatCurrency(this.credito.saldo);
    }
    return this.format.formatCurrency(0.0);
  }

  get creditoControl() {
    return this.form.get('credito');
  }

  get credito(): ClienteCredito {
    return this.creditoControl.value ? this.creditoControl.value : null;
  }

  get lineaDeCredito(): string {
    return this.credito
      ? this.credito.creditoActivo
        ? 'Activo'
        : 'Suspendido'
      : 'No tiene línea de crédito';
  }
  get atrasoMaximo(): number {
    return this.credito ? this.credito.atrasoMaximo : 0;
  }
}
