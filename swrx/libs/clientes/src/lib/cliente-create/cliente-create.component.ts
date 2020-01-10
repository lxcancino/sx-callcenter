import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl
} from '@angular/forms';
import { buildDireccionForm } from '@swrx/form-utils';

@Component({
  selector: 'swrx-cliente-create',
  templateUrl: './cliente-create.component.html',
  styleUrls: ['./cliente-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClienteCreateComponent implements OnInit {
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ClienteCreateComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.fb.group({
      nombre: [null, [Validators.required, Validators.minLength(5)]],
      rfc: [
        null,
        [
          Validators.required,
          Validators.minLength(12),
          Validators.maxLength(13)
        ]
      ],
      email: [null, [Validators.required, Validators.email]],
      direccion: buildDireccionForm(this.fb),
      telefonos: this.fb.array([
        new FormControl(null, {
          validators: [Validators.minLength(10)],
          updateOn: 'blur'
        }),
        new FormControl(null, {
          validators: [Validators.minLength(10)],
          updateOn: 'blur'
        }),
        new FormControl(null, {
          validators: [Validators.minLength(10)],
          updateOn: 'blur'
        })
      ])
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const value = this.form.getRawValue();
      const { nombre, rfc, direccion, email } = value;
      const medios = this.telefonos.value
        .filter(item => !!item)
        .map(item => {
          return {
            tipo: 'TEL',
            descripcion: item,
            sucursalCreated: 'CALLCENTER',
            sucursalUpdated: 'CALLCENTER',
            activo: true
          };
        });
      medios.push({
        tipo: 'MAIL',
        descripcion: email,
        sucursalCreated: 'CALLCENTER',
        sucursalUpdated: 'CALLCENTER',
        activo: true,
        cfdi: true
      });
      const entity = {
        nombre,
        rfc,
        direccion,
        email,
        medios,
        clave: 'PENDIENTE'
      };
      console.log('Cliente nuevo: ', entity);
      this.dialogRef.close(entity);
    }
  }

  get telefonos(): FormArray {
    return this.form.get('telefonos') as FormArray;
  }
}
