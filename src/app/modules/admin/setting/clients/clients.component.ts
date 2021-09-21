import { ClientsService } from './clients.service';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, map, switchMap, takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseUtilsService } from '../../../../../@fuse/services/utils/utils.service';
import { ClientPresenter } from './clients.presenter';


@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
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
  animations     : fuseAnimations,
  providers: [ClientPresenter],
})
export class ClientsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;

  public clients: any[]=[];
  public isLoading: boolean = true;


  flashMessage: 'success' | 'error' | null = null;

  searchInputControl: FormControl = new FormControl();
  selectedClient: any = null;
  selectedClientForm: FormGroup;
  tagsEditMode: boolean = false;


  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    public clientPresenter: ClientPresenter,
    private clientsService: ClientsService,
    private fuseUtilsService: FuseUtilsService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,
    private _formBuilder: FormBuilder
    ) { }

  ngOnInit(): void {
    this.cargarLista();
    this.initForm();
  }

  initForm() {
    this.selectedClientForm = this._formBuilder.group({
        id               : [''],
        category         : [''],
        name             : ['', [Validators.required]],
        lastName         : ['', [Validators.required]],
        email            : [''],
        createdDate      : [''],
        updatedDate      : [''],
        tags             : [[]],
        phone            : [''],
        barcode          : [''],
        brand            : [''],
        vendor           : [''],
        stock            : [''],
        images           : [[]],
        currentImageIndex: [0], // Image index that is currently being viewed
        active           : [false]
    });
}

  async cargarLista(){
    let resp: any;
    // console.log('lista product', await this.productsService.listarProductos())
    resp = await this.clientsService.listarClientes();
    if(resp.ok){
      // Get the products
      this.clients = resp.data;
      this.isLoading = false;
      console.log('lista clients',resp.data);
    }
   }

   toggleDetails(clientId: string, open: boolean): void
   {
       console.log('selectedClient', this.selectedClient);

       // If the product is already selected...
       if (this.selectedClient ) {
         if (this.selectedClient.uid === clientId )
         {
             // Close the details
             this.clientPresenter.resetClientForm();
             this.closeDetails();
             return;
         }
       }
     

       // Get the client by id
       const clienteEncontrado = this.clients.find(item => item.uid === clientId)  || null;
       this.selectedClient = clienteEncontrado;

       if (clienteEncontrado.uid) {
           this.clientPresenter.loadClientForm(clienteEncontrado);
       } else {
           this.clientPresenter.resetClientForm();
       }

       this.selectedClientForm.patchValue({
         id: clienteEncontrado.uid,
         name: clienteEncontrado.full_name.name,

     /*     descriptions: clienteEncontrado.descriptions.map(description =>{
             return (this.selectedClientForm.get('descriptions') as FormArray).push(this.createDescriptionForm(description));
         }), */
         lastName: clienteEncontrado.full_name.lastName,
         email: clienteEncontrado.email,
         phone: clienteEncontrado.phone,
         createdDate: this.fuseUtilsService.formatDate(this.fuseUtilsService.stringToDate(clienteEncontrado.createdAt)),
         updatedDate: this.fuseUtilsService.formatDate(this.fuseUtilsService.stringToDate(clienteEncontrado.updatedAt))
         
       });
       console.log('presneter client', this.clientPresenter.form.value)
       

      // this.stringToDate(clienteEncontrado.createdAt);


   //    console.log('fecha', this.formatDate(this.stringToDate(clienteEncontrado.createdAt)));
       
   }


  deleteSelectedClient(): void
  {
      // Open the confirmation dialog
      const confirmation = this._fuseConfirmationService.open({
          title  : 'Delete product',
          message: 'Are you sure you want to remove this product? This action cannot be undone!',
          actions: {
              confirm: {
                  label: 'Delete'
              }
          }
      });

      // Subscribe to the confirmation dialog closed action
      confirmation.afterClosed().subscribe((result) => {

          // If the confirm button pressed...
          if ( result === 'confirmed' )
          {

              // Get the product object
              const product = this.selectedClientForm.getRawValue();

              // Delete the product on the server
         /*      this._inventoryService.deleteProduct(product.id).subscribe(() => {

                  // Close the details
                  this.closeDetails();
              }); */
          }
      });
  }

  updateSelectedProduct(): void
  {
      // Get the product object
      const product = this.selectedClientForm.getRawValue();

      // Remove the currentImageIndex field
      delete product.currentImageIndex;

/*       // Update the product on the server
      this._inventoryService.updateProduct(product.id, product).subscribe(() => {

          // Show a success message
          this.showFlashMessage('success');
      }); */
  }
  showFlashMessage(type: 'success' | 'error'): void
  {
      // Show the message
      this.flashMessage = type;

      // Mark for check
      this._changeDetectorRef.markForCheck();

      // Hide it after 3 seconds
      setTimeout(() => {

          this.flashMessage = null;

          // Mark for check
          this._changeDetectorRef.markForCheck();
      }, 3000);
  }

   closeDetails(): void
   {
       this.selectedClient = null;
    //   this.initForm();
   }

   ngAfterViewInit(): void
   {
       if ( this._sort && this._paginator )
       {
           // Set the initial sort
           this._sort.sort({
               id          : 'name',
               start       : 'asc',
               disableClear: true
           });

           // Mark for check
           this._changeDetectorRef.markForCheck();

           // If the user changes the sort order...
           this._sort.sortChange
               .pipe(takeUntil(this._unsubscribeAll))
               .subscribe(() => {
                   // Reset back to the first page
                   this._paginator.pageIndex = 0;

                   // Close the details
                   this.closeDetails();
               });

           // Get products if sort or page changes
     /*       merge(this._sort.sortChange, this._paginator.page).pipe(
               switchMap(() => {
                   this.closeDetails();
                   this.isLoading = true;
                   return this._inventoryService.getProducts(this._paginator.pageIndex, this._paginator.pageSize, this._sort.active, this._sort.direction);
               }),
               map(() => {
                   this.isLoading = false;
               })
           ).subscribe(); */
       }
   }
   ngOnDestroy(): void
   {
       // Unsubscribe from all subscriptions
       this._unsubscribeAll.next();
       this._unsubscribeAll.complete();
   }
   createClient(){
    this.clients.unshift({
        full_name: {
            name: '',
            lastName: ''
        },
        phone: '',
        email: ''
    });

   }

}
