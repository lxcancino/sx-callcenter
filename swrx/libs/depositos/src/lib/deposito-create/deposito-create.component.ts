import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'swrx-deposito-create',
  templateUrl: './deposito-create.component.html',
  styleUrls: ['./deposito-create.component.scss']
})
export class DepositoCreateComponent implements OnInit {
  form: FormGroup;
  constructor(private dialogRef: MatDialogRef<DepositoCreateComponent>) {}

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.form = new FormGroup({
      fecha: new FormControl(new Date().toISOString(), [Validators.required]),
      cliente: new FormControl(null, [Validators.required]),
      banco: new FormControl(null, [Validators.required])
      // nombre: new FormControl(null, [Validators.required]),
      // fechaDeposito: new FormControl(null, [Validators.required]),
      // referencia: new FormControl(null),
      // importes: new FormGroup({
      // cheque: new FormControl(0.0),
      // efectivo: new FormControl(0.0),
      // transferencia: new FormControl(0.0)
      //})
    });
  }

  submit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
