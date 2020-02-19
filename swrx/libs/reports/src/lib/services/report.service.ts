import { Injectable, Inject } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';

import * as _ from 'lodash';
import { MatDialog, MatSnackBar } from '@angular/material';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl: string;
  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    @Inject('apiUrl') apiUrl
  ) {
    this.apiUrl = apiUrl;
  }

  run(url: string, repParams = {}): Observable<any> {
    let params = new HttpParams();
    _.forIn(repParams, (value, key) => {
      params = params.set(key, value);
    });
    const apiUrl = this.buildApiUrl(url);
    const headers = new HttpHeaders().set('Content-type', 'application/pdf');
    return this.http.get(apiUrl, {
      headers: headers,
      params: params,
      responseType: 'blob'
    });
  }

  runReport(url: string, repParams = {}) {
    this.run(url, repParams).subscribe(
      res => {
        const blob = new Blob([res], {
          type: 'application/pdf'
        });
        const fileUrl = window.URL.createObjectURL(blob);
        window.open(fileUrl, '_blank');
      },
      (error: HttpErrorResponse) => {
        console.log(error);
        const desc = `${error.message}`;
        const message = `Error:${error.status}, Rep:${url}`;
        this.snackBar.open(message, 'Cerrar', { duration: 10000 });
      }
    );
  }

  buildApiUrl(endpoint: string) {
    console.log('API URL', this.apiUrl);
    return `${this.apiUrl}/${endpoint}`;
  }
}
