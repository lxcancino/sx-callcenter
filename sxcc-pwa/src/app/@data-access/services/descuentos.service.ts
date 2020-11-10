import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';

import { DescuentoPorVolumen } from '@models';
import { AngularFirestore } from '@angular/fire/firestore';

import round from 'lodash-es/round';

@Injectable({ providedIn: 'root' })
export class DescuentosService {
  private url = 'assets/data/descuentos.json';

  descuentos$: Observable<DescuentoPorVolumen[]> = this.http
    .get<DescuentoPorVolumen[]>(this.url)
    .pipe(
      shareReplay(),
      catchError((error: any) => throwError(error))
    );

  private descuentos: DescuentoPorVolumen[];

  constructor(private http: HttpClient, private firestore: AngularFirestore) {
    this.descuentos$.subscribe((data) => (this.descuentos = data));
  }

  fetchDescuentos() {}

  findDescuentoPorVolumen(monto: number) {
    const mayores = this.descuentos.filter((item) => item.importe >= monto);
    return mayores.length > 0 ? mayores[0].descuento : 18;
  }

  findNexDescuento(monto: number) {
    const mayores = this.descuentos.filter((item) => item.importe >= monto);
    if (mayores.length > 1) {
      const current = mayores[0];
      const next = mayores[1];
      const limite = current.importe + 1;
      const faltante = limite - monto;
      const faltantePorcentual = round(faltante / limite, 3) * 100;
      return {
        current: monto,
        descuento: next.descuento,
        de: limite,
        hasta: next.importe,
        faltante,
        faltantePorcentual,
      };
    } else {
      // Ya esta en el maximo descuento
      return null;
    }
  }
}
