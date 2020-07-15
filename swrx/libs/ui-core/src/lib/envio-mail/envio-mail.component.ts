import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'swrx-envio-mail',
  template: `
    <div mat-dialog-title>
      {{ title }}
    </div>
    <mat-dialog-content>
      <mat-form-field [style.width.%]="100">
        <input
          matInput
          type="email"
          [formControl]="control"
          placeholder="Email destino"
        />
      </mat-form-field>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-flat-button [mat-dialog-close]>Cancelar</button>
      <button
        mat-flat-button
        color="primary"
        (click)="onSubmit()"
        [disabled]="control.invalid"
      >
        <span>Enviar</span>
      </button>
    </mat-dialog-actions>
  `
})
export class EnvioMailComponent implements OnInit {
  title: string;
  control: FormControl;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    private dialogRef: MatDialogRef<EnvioMailComponent>
  ) {
    this.control = new FormControl(data.email, [
      Validators.required,
      Validators.email
    ]);
    this.title = data.title || 'Envio de correo electrónico';
  }

  ngOnInit() {}

  onSubmit() {
    if (this.control.valid) {
      this.dialogRef.close(this.control.value);
    }
  }
}
