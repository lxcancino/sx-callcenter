import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Pedido } from '@swrx/core-model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = 'http://localhost:8080/callcener/api/pedidos';
  // http://localhost:8080/callcener

  constructor(private http: HttpClient) {}

  save(payload: Partial<Pedido>): Observable<Pedido> {
    return this.http.post<Pedido>(this.apiUrl, payload);
  }
}
