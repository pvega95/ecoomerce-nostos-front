import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class ProductsService {
  static readonly BASE_URL = `${environment.backendURL}`;

  constructor(private http: HttpClient) {}

  async listarProductos(): Promise<any> {
    const url = `${ProductsService.BASE_URL}/product-management`;
    const  data  = (await this.http.get(url).toPromise()) as any;
    return data ;
  }
}