import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnDestroy,
  Inject
} from '@angular/core';

import { FormGroup } from '@angular/forms';

import { map, takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'swrx-direccion-form',
  templateUrl: './direccion-form.component.html',
  styleUrls: ['./direccion-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DireccionFormComponent implements OnInit, OnDestroy {
  @Input() parent: FormGroup;
  @Input() propertyName = 'direccion';
  destroy$ = new Subject();
  apiUrl: string;
  @Input() colonias = [];

  constructor(private http: HttpClient, @Inject('apiUrl') api) {
    this.apiUrl = `${api}/zip`;
  }

  ngOnInit() {
    this.parent
      .get(this.propertyName)
      .get('codigoPostal')
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        filter(term => !!term)
      )
      .subscribe(zip => this.registrarCodigoPostal(zip));
    const colonia = this.form.get('colonia').value;
    this.parent
      .get(this.propertyName)
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        console.log('Col: ', val);
        if (colonia && this.colonias.length === 0) {
          this.colonias.push(colonia);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  registrarCodigoPostal(zip: string) {
    const params = new HttpParams().set('zip', zip);
    this.http
      .get(this.apiUrl, {
        params: params
      })
      .subscribe(
        (registros: any) => {
          if (registros.codigoPostal) {
            this.colonias = registros.colonias;
            this.update(registros);
          }
        },
        response => console.log('Http Error: ', response)
      );
  }

  private update(zipData: any) {
    const { estado, municipio, pais, colonias } = zipData;
    this.form.patchValue({ estado, municipio, pais });
    // this.form.get('colonia').setValue(colonias[0]);
  }

  get form() {
    return this.parent.get(this.propertyName);
  }
}
