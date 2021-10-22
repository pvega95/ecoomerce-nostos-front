import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class ProductsService {
  static readonly BASE_URL = `${environment.backendURL}`;

      /**
     * Getter for products
     */
    /*    get products$(): Observable<InventoryProduct[]>
       {
           return this._products.asObservable();
       } */

  constructor(private http: HttpClient) {}

  async listarProductos(): Promise<any> {
    const url = `${ProductsService.BASE_URL}/product-management`;
    const  data  = (await this.http.get(url).toPromise()) as any;
    return data ;
  }

  async crearProducto(body: any): Promise<any> {
    const url = `${ProductsService.BASE_URL}/product-management`;
    const  data  = (await this.http.post(url, body).toPromise()) as any;
    return data ;
  }

  async actualizarProducto(body: any, id: string ): Promise<any> {
    const url = `${ProductsService.BASE_URL}/product-management/${ id }`;
    // return null;
    const  data  = (await this.http.put(url, body).toPromise()) as any;
    return data ;
  }
  async eliminarProducto(id: string ): Promise<any> {
    const url = `${ProductsService.BASE_URL}/product-management/${id}`;
    // return null;
    const  data  = (await this.http.delete(url).toPromise()) as any;
    return data ;
  }

/*   createProduct(): Observable<any>
  {
      return this.products$.pipe(
          take(1),
          switchMap(products => this._httpClient.post<InventoryProduct>('api/apps/ecommerce/inventory/product', {}).pipe(
              map((newProduct) => {

                  // Update the products with the new product
                  this._products.next([newProduct, ...products]);

                  // Return the new product
                  return newProduct;
              })
          ))
      );
  } */


}