import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'swrx-deposito-importes-field',
  templateUrl: './deposito-importes-field.component.html',
  styleUrls: ['./deposito-importes-field.component.scss']
})
export class DepositoImportesFieldComponent implements OnInit {
  @Input() parent: FormGroup;
  constructor() {}

  ngOnInit() {}
}
