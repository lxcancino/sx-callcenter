import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
  OnDestroy
} from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'swrx-direccion',
  templateUrl: './direccion.component.html',
  styleUrls: ['./direccion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DireccionComponent implements OnInit, OnDestroy {
  form: FormGroup;
  destroy$ = new Subject();

  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    private dialogRef: MatDialogRef<DireccionComponent>,
    private fb: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.buildForm();
    this.form
      .get('codigoPostal')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(zip => this.registrarCodigoPostal(zip));
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  buildForm() {
    this.form = this.fb.group({
      calle: [null, [Validators.required]],
      numeroExterior: [null, [Validators.required]],
      numeroInterior: [null, [Validators.required]],
      codigoPostal: [
        null,
        { validators: [Validators.required], updateOn: 'blur' }
      ],
      colonia: [null, [Validators.required]],
      monicipio: [null, [Validators.required]],
      estado: [null, [Validators.required]],
      pais: ['MEXICO', [Validators.required]]
    });
  }

  doSubmit() {
    if (this.form.valid) {
      const data = { ...this.form.value };
      this.dialogRef.close(data);
    }
  }

  registrarCodigoPostal(zip: string) {
    console.log('Localizando colonias, estado y municipio: ', zip);
    /*
    const params = new HttpParams().set('zip_code', zip);
    this.http
      .get('http://sepomex.icalialabs.com/api/v1/zip_codes', {
        params: params
      })
      .pipe(map((response: any) => response.zip_codes))
      .subscribe((registros: any[]) => {
        const estado: string = registros.map(item => item.d_estado)[0];
        const municipio: string = registros.map(item => item.d_mnpio)[0];
        if (estado) {
          this.form.get('estado').setValue(estado.toUpperCase());
        }
        if (municipio) {
          this.form.get('municipio').setValue(municipio.toUpperCase());
        }
        const colonias = registros.map(item => item.d_asenta.toUpperCase());
        // _.map(registros, item => item.d_asenta.toUpperCase());
        // this.colonias = colonias;
      });
      */
  }
}
