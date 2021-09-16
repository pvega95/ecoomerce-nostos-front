import { Component, OnInit, Inject, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Modal } from '../../enums/modal.enum';
import { ProductsService } from '../../modules/admin/setting/products/products.service';
import { ClientsService } from '../../modules/admin/setting/clients/clients.service';
import { MatSelect } from '@angular/material/select';
import { Select } from 'app/models/select';
import { Router } from '@angular/router';



@Component({
  selector: 'app-window-modal',
  templateUrl: './window-modal.component.html',
  styleUrls: ['./window-modal.component.scss']
})
export class WindowModalComponent implements OnInit {
  public existListFile: boolean = false;
  public typeModal: any;
  public listFiles: File[] = [];
  public orderForm: FormGroup;
  public products: any[];
  public clients: any[];
  public isLoading: boolean = true;
  public listObjClient: Select[];
  public listObjProduct: Select[];
  public clientAvailableSearch: boolean = true;
  public productAvailableSearch: boolean = true;
  public total: number = 0;

  constructor(
    private _formBuilder: FormBuilder,
    private productsService: ProductsService,
    private clientsService: ClientsService,
    public router: Router,
    public dialogRef: MatDialogRef<WindowModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.typeModal = Modal;
   }

  ngOnInit(): void {
   console.log('data', Modal.loading)
   if (this.data.type === this.typeModal.newOrder) {
     this.loadData();     
   }
    this.initForm();
  }

async  loadData(): Promise<void>{
  let resp1: any;
  let resp2: any;
  this.products = [];
  this.clients = [];
  this.listObjClient = [];
  this.listObjProduct = [];
  resp1 = await this.productsService.listarProductos();
  resp2 = await this.clientsService.listarClientes();

    if (resp1.ok && resp2.ok) {
      // Get the products
      this.products = this.formatProduct(resp1.data);  
      this.clients = this.formatClient(resp2.data);
      this.isLoading = false;
      if ( this.clients.length > 0) {
        this.clients.forEach(element => {
          this.listObjClient.push({
            id: element.id,
            label: element.fullName
          })
        });
      }
      if (this.products.length > 0) {
        this.products.forEach(element => {
          this.listObjProduct.push({
            id: element.id,
            label: element.name
          })
        });
      }
      this.addProduct();
      console.log(' this.products ',  this.products, this.clients )
    }
  }
  objClientSelected(objClient: Select){
    console.log('salidaaa', objClient)
  }
  objProductSelected(objProduct: Select, i: number){
    this.productsControls[i].patchValue({
      product: objProduct
    });
  }

  initForm(): void{
    this.orderForm = this._formBuilder.group({
      clientSelected: new FormControl('', Validators.required),
      products: new FormArray([]),
      quantity: new FormControl('', Validators.required),
    });
  }
  get productsForm(){
    return this.orderForm.get('products') as FormArray;
  }
  addProduct(): void{
    console.log('se agrego rpdocuto')
    const formProduct = this.createProductForm();
    this.productsForm.push(formProduct);
  }
  createProductForm(): FormGroup{
    return new FormGroup({
      product: new FormControl(),
      quantity: new FormControl(1)
    });
  }
  get productsControls(){
    return this.productsForm.controls as FormGroup[];
  }

  formatClient(clientRaw){
    let lista:any[] = [];
    clientRaw.forEach(element => {
      lista.push({
        id: element.uid,
        fullName: element.full_name.name + ' ' + element.full_name.lastName
      });
    });
    return lista;
  }

  onNoClick(): void {
    this.listFiles = [];
    this.dialogRef.close(this.listFiles);
  }
  imagenesCargadas(): void{
    this.dialogRef.close(this.listFiles);
  }
  getFilesLoades(files: File[]):void{
     console.log('files', files)
     if(files.length > 0){
       this.existListFile = true;
       this.listFiles = files;
     }else{
      this.existListFile = false;
      this.listFiles = [];
     }
  }

  formatProduct(productRaw) {
    let lista:any[] = [];
   productRaw.forEach(element => {
    lista.push({
      id: element._id,
      sku: element.sku,
      name: element.name,
      price: element.price
      });
    });
    return lista;
}
listClientAvailable(val: boolean): void{
this.clientAvailableSearch = val;
}
listProductAvailable(val: boolean): void{
  this.productAvailableSearch = val;
  }
goToClient(): void{
  this.router.navigate(['setting/clients']);
  this.dialogRef.close();
}




}
