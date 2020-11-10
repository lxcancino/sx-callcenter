import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { PedidoParams } from '@models';

@Component({
  selector: 'sxcc-create-options',
  template: `
    <ion-button (click)="showOptions()">
      <ion-icon name="options" slot="icon-only"></ion-icon>
    </ion-button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOptionsComponent implements OnInit {
  @Input() params: PedidoParams;
  constructor() {}

  ngOnInit() {}

  async showOptions() {
    console.log('Show options for: ', this.params);
  }
}
