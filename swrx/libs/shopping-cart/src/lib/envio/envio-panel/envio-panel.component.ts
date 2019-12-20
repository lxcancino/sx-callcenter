import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { InstruccionDeEnvio } from '@swrx/core-model';

@Component({
  selector: 'swrx-envio-panel',
  templateUrl: './envio-panel.component.html',
  styleUrls: ['./envio-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnvioPanelComponent implements OnInit {
  @Input() envio: InstruccionDeEnvio;
  @Output() actualizar = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  get direccion() {
    return this.envio.direccion;
  }
}