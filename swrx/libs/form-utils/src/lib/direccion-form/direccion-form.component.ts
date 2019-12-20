import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';

import { FormGroup } from '@angular/forms';

@Component({
  selector: 'swrx-direccion-form',
  templateUrl: './direccion-form.component.html',
  styleUrls: ['./direccion-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DireccionFormComponent implements OnInit {
  @Input() parent: FormGroup;
  @Input() propertyName = 'direccion';

  constructor() {}

  ngOnInit() {}
}
