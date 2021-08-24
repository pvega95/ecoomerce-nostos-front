import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, map, switchMap, takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { InventoryBrand, InventoryCategory, InventoryPagination, InventoryProduct, InventoryTag, InventoryVendor } from 'app/modules/admin/apps/ecommerce/inventory/inventory.types';
import { OrdersService } from './order.service';
import { InventoryService } from 'app/modules/admin/apps/ecommerce/inventory/inventory.service';
import { FuseUtilsService } from '../../../../@fuse/services/utils/utils.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styles: [
               /* language=SCSS */
               `
               .inventory-grid {
                   grid-template-columns: 48px auto 40px;
    
                   @screen sm {
                       grid-template-columns: 48px auto 112px 72px;
                   }
    
                   @screen md {
                       grid-template-columns: 14rem 14rem 6rem 12rem 8rem;
                   }
    
                   @screen lg {
                       grid-template-columns: 14rem 14rem 6rem 12rem 8rem;
                   }
               }
           `
  ],
  animations     : fuseAnimations
})
export class OrderComponent implements OnInit {

  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;
  public orders: any[]=[];
  public isLoading: boolean = true;

  constructor(
    private ordersService: OrdersService,
    private fuseUtilsService: FuseUtilsService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,
    private _formBuilder: FormBuilder,
    private _inventoryService: InventoryService
  ) { }

  ngOnInit(): void {
    this.cargarLista();
  }

  async cargarLista(){
    let resp: any;
    resp = await this.ordersService.listarOrdenes();
    if(resp.ok){
      // Get the orders
      this.orders = resp.data;
      this.isLoading = false;
      console.log('lista ordenes',resp.data);
    }
   }
   openModal(){
     
   }

}
