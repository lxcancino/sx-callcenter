import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  ValidatorFn
} from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Subject } from 'rxjs';
import { Cliente, InstruccionDeEnvio, Socio } from '@swrx/core-model';
import { buildDireccionForm } from '@swrx/form-utils';
import { takeUntil } from 'rxjs/operators';
import { getEnvioDisplayName } from './envio.utils';

const EnvioValidator: ValidatorFn = (fg: FormGroup) => {
  const tipo = fg.get('tipo').value;
  if (tipo && tipo === 'FORANEO') {
    const transporte = fg.get('transporte').value;
    return transporte ? null : { transporteRequerido: true };
  }
  return null;
};

@Component({
  selector: 'swrx-envio',
  templateUrl: './envio.component.html',
  styleUrls: ['./envio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnvioComponent implements OnInit, OnDestroy {
  form: FormGroup;
  destroy$ = new Subject();
  cliente: Cliente;
  socio: Socio;
  envio: InstruccionDeEnvio;
  direcciones: {};
  selectedKey: string;

  nueva = false;
  tipos = ['ENVIO', 'FORANEO', 'OCURRE', 'ENVIO_CARGO'];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<EnvioComponent>,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('Envio para: ', this.data);
    this.envio = this.data.envio;
    this.cliente = this.data.cliente;
    this.socio = this.data.socio;
    this.direcciones = this.cliente.direcciones || {};
    if (this.socio) {
      this._buildDireccionDesocio(this.socio);
    }
    /*
    if (this.data.pedido && this.data.pedido.socio) {
      this._buildDireccionDesocio(this.data.pedido.socio);
    }
    */
    this.buildForm();

    if (this.envio) {
      this.form.patchValue(this.envio);
      const dd = this.envio.direccion;
      const calle = dd.calle.trim() || '';
      const key = `${calle.substr(0, 10)} #:${dd.numeroExterior || ''} CP:${
        dd.codigoPostal
      }`;
      const direccion = this.direcciones[key];
      if (direccion) {
        this.selectedKey = key;
        this.form.get('direccion').disable();
        this.nueva = false;
      }
      if (this.envio.transporte) {
        this.form.get('transporte').setValue(this.envio.transporte);
      }
      this.cd.markForCheck();
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  buildForm() {
    this.form = this.fb.group(
      {
        tipo: ['ENVIO', [Validators.required]],
        transporte: [{ value: null, disabled: true }],
        contacto: [null, [Validators.required]],
        telefono: [null, [Validators.required]],
        horario: [null, [Validators.required]],
        comentario: [],
        fechaDeEntrega: [null],
        direccion: buildDireccionForm(this.fb)
      },
      { validators: [] }
    );
    // this.form.get('direccion').disable();
    this.form
      .get('tipo')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        if (value === 'FORANEO' || value === 'OCURRE') {
          this.form.get('transporte').enable();
        } else {
          this.form.get('transporte').disable();
        }
      });
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

  _buildDireccionDesocio(socio: Socio) {
    // console.log('Generando registrando direccion del socio: ', socio);
    if (socio.direccionFiscal) {
      const dd = socio.direccionFiscal;
      const calle = dd.calle.trim() || '';
      const key = `${calle.substr(0, 10)} #:${dd.numeroExterior || ''} CP:${
        dd.codigoPostal
      }`;
      this.direcciones = {};
      this.direcciones[key] = dd;
    }
  }

  getDisplayValue(tipo: string) {
    return getEnvioDisplayName(tipo);
  }
}
