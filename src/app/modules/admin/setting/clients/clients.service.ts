import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class ClientsService {
  static readonly BASE_URL = `${environment.backendURL}`;

  constructor(private http: HttpClient) {}

  async listarClientes(): Promise<any> {
    const url = `${ClientsService.BASE_URL}/user-management`;
    const  data  = (await this.http.get(url).toPromise()) as any;
    return data ;
  }
  async listarDepartamentos(): Promise<any> {
    const url = `${ClientsService.BASE_URL}/ubigeo-management/departments`;
    const  data  = (await this.http.get(url).toPromise()) as any;
    return data ;
  }
  async listarProvincias(departmentId: string): Promise<any> {
    const url = `${ClientsService.BASE_URL}/ubigeo-management/province/${departmentId}`;
    const  data  = (await this.http.get(url).toPromise()) as any;
    return data ;
  }
  async listarDistritos(provinceId: string): Promise<any> {
    const url = `${ClientsService.BASE_URL}/ubigeo-management/distrito/${provinceId}`;
    const  data  = (await this.http.get(url).toPromise()) as any;
    return data ;
  }

  async consultaDireccionCliente(idUser: string): Promise<any> {
    const url = `${ClientsService.BASE_URL}/ubigeo-management/address/${idUser}`;
    const  data  = (await this.http.get(url).toPromise()) as any;
    return data ;
  }
}