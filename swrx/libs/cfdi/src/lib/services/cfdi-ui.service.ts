import { Injectable, Inject } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';

import forIn from 'lodash/forIn';
import { MatDialog, MatSnackBar } from '@angular/material';

import { Observable } from 'rxjs';
import { CfdiSelectorComponent } from '../components';

@Injectable({
  providedIn: 'root'
})
export class CfdiUiService {
  private apiUrl: string;
  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    @Inject('cfdiApiUrl') apiUrl
  ) {
    this.apiUrl = apiUrl;
  }

  private run(id: string): Observable<any> {
    const apiUrl = `${this.apiUrl}/cfdi/${id}`;
    const headers = new HttpHeaders().set('Content-type', 'application/pdf');
    return this.http.get(apiUrl, {
      headers: headers,
      params: {},
      responseType: 'blob'
    });
  }

  downloadCfdi(id: string) {
    this.run(id).subscribe(
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
        const message = `Error:${error.status}, Cfdi:${id}`;
        this.snackBar.open(message, 'Cerrar', { duration: 10000 });
      }
    );
  }

  viewCfdi() {
    this.dialog
      .open(CfdiSelectorComponent, {})
      .afterClosed()
      .subscribe(id => {
        if (id) {
          this.downloadCfdi(id);
        }
      });
  }
}
