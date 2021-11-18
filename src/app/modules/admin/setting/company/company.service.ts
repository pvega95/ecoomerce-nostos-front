import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Company, ICompany } from '../../../../models/company';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
  })

  
  export class CompanyService {
    static readonly BASE_URL = `${environment.backendURL}`;
  
    constructor(private http: HttpClient) {}
    formatErrors(error: HttpErrorResponse) {
        const messageError = error.error ? error.error : error;
        return throwError(messageError);
      }
  
    getListCompany():  Observable<any> {
      const url = `${CompanyService.BASE_URL}/configuration-management/company`;
      return this.http.get(url).pipe(
        catchError(error => {
          return this.formatErrors(error);
        })
      );
    } 
  }