import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, map, switchMap, takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { OrdersService } from './order.service';
import { FuseUtilsService } from '../../../../@fuse/services/utils/utils.service';
import { StatusOrder } from '../../../enums/status.enum';
import { stringify } from 'crypto-js/enc-base64';
import { WindowModalComponent } from '../../../shared/window-modal/window-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Modal } from '../../../enums/modal.enum';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: [ './order.component.scss'],
  animations     : fuseAnimations
})
export class OrderComponent implements OnInit {

  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;
  public orders: any[]=[];
  public products: any[]=[];
  public isLoading: boolean = true;
  selectedOrder: any = null;
  selectedOrderForm: FormGroup;
  selected: number;

  searchInputControl: FormControl = new FormControl();

  constructor(
    private ordersService: OrdersService,
    private fuseUtilsService: FuseUtilsService,
    private _changeDetectorRef: ChangeDetectorRef,
    public dialog: MatDialog,
    private _fuseConfirmationService: FuseConfirmationService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.cargarLista(); 
  this.dialog.open(WindowModalComponent, {
      data: {
              type: Modal.success
          },
      disableClose: true
    }); 

/*     setTimeout(()=>{  // 3 segundo se cierra modal
      this.dialog.closeAll();
  }, 3000); */
  }





  async cargarLista(){
    let resp: any;
    resp = await this.ordersService.listarOrdenes();
    if(resp.ok){
      // Get the ordersn
      this.orders = resp.data;
      this.isLoading = false;
      console.log('lista ordenes',resp.data);
    }
   }
   loadColorState(status: any): string{
    let styleColor: string = '';
    switch (status) {
      case StatusOrder.Creado:{
        styleColor = 'colorStadoCreado';
        break;
      }
      case StatusOrder.Cancelado:{
        styleColor = 'colorStadoCancelado';
        break;
      }
        
      default:
        break;
    }


    return styleColor;
   }

   toggleDetails(orderId: string, open: boolean): void
   {
       console.log('selectedOrder', this.selectedOrder);

       // If the order is already selected...
       if (this.selectedOrder ) {
         if (this.selectedOrder._id === orderId )
         {
             // Close the details
             this.closeDetails();
             return;
         }
       }
       this.initForm();
     

       // Get the order by id
       const orderEncontrado = this.orders.find(item => item._id === orderId)  || null;
      
       this.selectedOrder = orderEncontrado;
       if(orderEncontrado._id){
         this.products = [];
           this.selectedOrderForm.patchValue({
             id: orderEncontrado._id,
             name: orderEncontrado.name,
             sku: orderEncontrado.sku,
             category: orderEncontrado.category
             
           });
           this.products = orderEncontrado.products;

       }else{
           let descriptions = ['']
           this.selected = -1;
           this.selectedOrderForm.patchValue({
               id: -1,
               name: '',
               sku: '',
               category: '',
               stock: '',
               images: '',
               price: '',
               weight: ''
               
             });

       }
 
   }
   initForm() {
    this.selectedOrderForm = this._formBuilder.group({
        id               : [''],
        category         : [''],
        name             : ['', [Validators.required]],
        descriptions     : this._formBuilder.array([]),
        createdDate      : [''],
        updatedDate      : [''],
        tags             : [[]],
        sku              : [''],
        barcode          : [''],
        brand            : [''],
        vendor           : [''],
        stock            : [''],
        reserved         : [''],
        cost             : [''],
        basePrice        : [''],
        taxPercent       : [''],
        price            : [''],
        weight           : [''],
        thumbnail        : [''],
        images           : [[]],
        currentImageIndex: [0], // Image index that is currently being viewed
        active           : [false]
    });
}
   closeDetails(): void
   {
       this.selectedOrder = null;
   }
   formatoFecha(fecha: string): string{
    return this.fuseUtilsService.formatDate(this.fuseUtilsService.stringToDate(fecha))
  }


}
