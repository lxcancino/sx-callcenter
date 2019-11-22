import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'swrx-cliente-selector',
  templateUrl: './cliente-selector.component.html',
  styleUrls: ['./cliente-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClienteSelectorComponent implements OnInit {
  control = new FormControl(null, Validators.required);

  constructor() {}

  ngOnInit() {}
}
