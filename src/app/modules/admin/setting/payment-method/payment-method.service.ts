import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { PaymentMethod } from '../../../../models/payment-method';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
  })

  
  export class PaymentMethodService {
    static readonly BASE_URL = `${environment.backendURL}`;
    static readonly confManagement = '/configuration-management';
    constructor(private http: HttpClient) {}
    formatErrors(error: HttpErrorResponse) {
        const messageError = error.error ? error.error : error;
        return throwError(messageError);
      }
  
    getListPaymentMethod():  Observable<any> {
      const url = `${PaymentMethodService.BASE_URL}${PaymentMethodService.confManagement}/payment-method`;
      return this.http.get(url).pipe(
        catchError(error => {
          return this.formatErrors(error);
        })
      );
    } 
    /**
     * 
     * @param body 
     * @returns 
     */
    createPaymentMethod(body: PaymentMethod):  Observable<any> {
      const url = `${PaymentMethodService.BASE_URL}${PaymentMethodService.confManagement}/payment-method`;
      return this.http.post(url, body).pipe(
        catchError(error => {
          return this.formatErrors(error);
        })
      );
    } 
    updatePaymentMethod(id: string, body: PaymentMethod):  Observable<any> {
      const url = `${PaymentMethodService.BASE_URL}${PaymentMethodService.confManagement}/payment-method/${id}`;
      return this.http.put(url, body).pipe(
        catchError(error => {
          return this.formatErrors(error);
        })
      );
    } 
    deletePaymentMethod(id: string):  Observable<any> {
      const url = `${PaymentMethodService.BASE_URL}${PaymentMethodService.confManagement}/payment-method/${id}`;
      return this.http.delete(url).pipe(
        catchError(error => {
          return this.formatErrors(error);
        })
      );
    } 

  }