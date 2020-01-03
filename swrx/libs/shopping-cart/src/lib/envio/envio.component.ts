import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
  OnDestroy
} from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Subject, Observable } from 'rxjs';
import {
  Direccion,
  Cliente,
  buildDireccionEmpty,
  InstruccionDeEnvio
} from '@swrx/core-model';
import { buildDireccionForm } from '@swrx/form-utils';

@Component({
  selector: 'swrx-envio',
  templateUrl: './envio.component.html',
  styleUrls: ['./envio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnvioComponent implements OnInit {
  form: FormGroup;
  destroy$ = new Subject();
  cliente: Cliente;
  envio: InstruccionDeEnvio;
  direcciones: {};
  selectedKey: string;

  nueva = false;
  tipos = ['ENVIO', 'FORANEO', 'OCURRE', 'ENVIO_CARGO'];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<EnvioComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.envio = this.data.envio;
    this.cliente = this.data.cliente;
    this.direcciones = this.cliente.direcciones || {};
    this.buildForm();
    if (this.envio) {
      this.form.patchValue(this.envio);
      const dd = this.envio.direccion;
      const calle = dd.calle.trim() || '';
      const key = `${calle.substr(0, 10)} #:${dd.numeroExterior} CP:${
        dd.codigoPostal
      }`;
      const direccion = this.direcciones[key];
      if (direccion) {
        this.selectedKey = key;
      }
    }
  }

  buildForm() {
    this.form = this.fb.group({
      tipo: [],
      contacto: [],
      telefono: [],
      horario: [],
      comentario: [],
      direccion: buildDireccionForm(this.fb)
    });
    // this.form.get('direccion').disable();
  }

  onSelect(event: any) {
    if (event.value === 'NUEVA') {
      this.form.get('direccion').enable();
      this.form.get('direccion').reset();
      this.nueva = true;
    } else {
      const selected = this.direcciones[event.value];
      this.form.get('direccion').patchValue(selected, { emitEvent: false });
      this.form.get('direccion').disable();
      this.nueva = false;
    }
  }

  get direccionesNombre() {
    return Object.keys(this.direcciones);
  }

  doSubmit() {
    if (this.form.valid) {
      const data = { ...this.form.getRawValue() };
      this.dialogRef.close(data);
    }
  }

  isDirectionValid() {
    return this.form.get('direccion').valid;
  }
}
