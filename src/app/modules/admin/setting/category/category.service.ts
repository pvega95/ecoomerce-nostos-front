import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class CategoriesService {
  static readonly BASE_URL = `${environment.backendURL}`;


  constructor(private http: HttpClient) {}

  async listarCategorias(): Promise<any> {
    const url = `${CategoriesService.BASE_URL}/category-management`;
    const  data  = (await this.http.get(url).toPromise()) as any;
    return data ;
  }

  async crearCategoria(body: any): Promise<any> {
    const url = `${CategoriesService.BASE_URL}/category-management`;
    const  data  = (await this.http.post(url, body).toPromise()) as any;
    return data ;
  }
  async eliminarCategoria(id: string): Promise<any> {
    const url = `${CategoriesService.BASE_URL}/category-management/${id}`;
    const  data  = (await this.http.delete(url).toPromise()) as any;
    return data ;
  }



}