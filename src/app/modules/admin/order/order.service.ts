import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class OrdersService {
  static readonly BASE_URL = `${environment.backendURL}`;

  constructor(private http: HttpClient) {}

  async listarOrdenes(): Promise<any> {
    const url = `${OrdersService.BASE_URL}/order-management`;
    const  data  = (await this.http.get(url).toPromise()) as any;
    return data ;
  }
}