import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { InstruccionDeEnvio, Direccion } from '@swrx/core-model';

import { getEnvioDisplayName } from '../envio.utils';

@Component({
  selector: 'swrx-envio-panel',
  templateUrl: './envio-panel.component.html',
  styleUrls: ['./envio-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnvioPanelComponent implements OnInit {
  @Input() envio: InstruccionDeEnvio;
  @Output() actualizar = new EventEmitter();
  @Output() cancelar = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  get direccion() {
    return this.envio.direccion;
  }

  getDireccionLabel(direccion: Direccion) {
    return `${direccion.calle} ${direccion.numeroExterior} Mpo: ${direccion.municipio} Cp:${direccion.codigoPostal}`;
  }

  getTipoLabel(tipo: string) {
    return getEnvioDisplayName(tipo);
  }
}
