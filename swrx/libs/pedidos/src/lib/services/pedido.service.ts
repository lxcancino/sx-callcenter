import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Pedido, Periodo, User, PedidoAutorizacion } from '@swrx/core-model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Update } from '@ngrx/entity';
@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl: string;

  constructor(private http: HttpClient, @Inject('apiUrl') api) {
    this.apiUrl = `${api}/pedidos`;
  }

  list(periodo: Periodo = Periodo.mesActual()): Observable<Pedido[]> {
    const data = periodo.toApiJSON();
    const params = new HttpParams()

      .set('fechaInicial', data.fechaInicial)
      .set('fechaFinal', data.fechaFinal);
    return this.http
      .get<Pedido[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  save(payload: Partial<Pedido>): Observable<Pedido> {
    return this.http.post<Pedido>(this.apiUrl, payload);
  }

  get(id: string): Observable<Pedido> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Pedido>(url);
  }

  update(update: Update<Pedido>): Observable<Pedido> {
    const url = `${this.apiUrl}/${update.id}`;
    return this.http
      .put<Pedido>(url, update.changes)
      .pipe(catchError((error: any) => throwError(error)));
  }

  cerrar(pedido: Partial<Pedido>): Observable<Pedido> {
    const url = `${this.apiUrl}/cerrar/${pedido.id}`;
    return this.http
      .put<Pedido>(url, {})
      .pipe(catchError((error: any) => throwError(error)));
  }

  autorizar(id: string, auth: PedidoAutorizacion): Observable<Pedido> {
    const changes = { autorizacion: auth };
    const update: Update<Partial<Pedido>> = { id, changes };
    return this.update(update);
  }

  delete(id: string) {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .delete(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  porAutorizar(): Observable<any[]> {
    const url = `${this.apiUrl}/porAutorizar`;
    return this.http
      .get<Pedido[]>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  buscarSucursal(codigoPostal: string) {
    const url = `${this.apiUrl}/buscarSucursal`;
    const params = new HttpParams().set('codigoPostal', codigoPostal);
    return this.http
      .get(url, { params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  findPeddos(periodo: Periodo): Observable<Pedido[]> {
    const url = `${this.apiUrl}/search`;
    const params = new HttpParams()
      .set('fechaInicial', periodo.fechaInicial.toISOString())
      .set('fechaFinal', periodo.fechaFinal.toISOString());
    return this.http
      .get<Pedido[]>(url, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  findPeddosCerrados(periodo: Periodo): Observable<Pedido[]> {
    const url = `${this.apiUrl}/search`;
    const params = new HttpParams()
      .set('tipo', 'CERRADOS')
      .set('fechaInicial', periodo.fechaInicial.toISOString())
      .set('fechaFinal', periodo.fechaFinal.toISOString());
    return this.http
      .get<Pedido[]>(url, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  findPeddosFacturados(periodo: Periodo): Observable<Pedido[]> {
    const url = `${this.apiUrl}/search`;
    const params = new HttpParams()
      .set('fechaInicial', periodo.fechaInicial.toISOString())
      .set('fechaFinal', periodo.fechaFinal.toISOString())
      .set('tipo', 'FACTURADOS');
    return this.http
      .get<Pedido[]>(url, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }
}
