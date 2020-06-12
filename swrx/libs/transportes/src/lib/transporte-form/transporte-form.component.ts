import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Transporte } from '@swrx/core-model';
import { buildDireccionForm } from '@swrx/form-utils';

@Component({
  selector: 'swrx-transporte-form',
  templateUrl: './transporte-form.component.html',
  styleUrls: ['./transporte-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransporteFormComponent implements OnInit {
  form: FormGroup;
  transporte: Transporte;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<
      TransporteFormComponent,
      Partial<Transporte>
    >,
    private fb: FormBuilder
  ) {
    this.transporte = data.transporte;
  }

  ngOnInit() {
    this.form = this.fb.group({
      nombre: [null, Validators.required],
      telefono1: [null],
      telefono2: [null],
      telefono3: [null],
      sucursal: [null],
      direccion: this.fb.group(
        {
          calle: [null, [Validators.required]],
          numeroExterior: [null, [Validators.required]],
          numeroInterior: [null],
          codigoPostal: [
            null,
            { validators: [Validators.required], updateOn: 'blur' }
          ],
          colonia: [null, [Validators.required]],
          municipio: [null],
          estado: [null, [Validators.required]],
          pais: ['MEXICO', [Validators.required]]
        },
        { updateOn: 'blur', validators: [Validators.required] }
      )
    });
    if (this.transporte) {
      this.form.patchValue(this.transporte);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const data: Partial<Transporte> = this.form.getRawValue();
      // console.log('Data: ', data);
      this.dialogRef.close(data);
    }
  }
}
