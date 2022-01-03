import { Component, OnInit, Inject, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Modal } from '../../enums/modal.enum';
import { ProductsService } from '../../modules/admin/setting/products/products.service';
import { ClientsService } from '../../modules/admin/setting/clients/clients.service';
import { OrdersService } from '../../modules/admin/order/order.service';
import { FuseUtilsService } from '../../../@fuse/services/utils/utils.service';
import { MatSelect } from '@angular/material/select';
import { Select } from 'app/models/select';
import { Router } from '@angular/router';
import { Product } from 'app/models/product';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { VoucherDetail } from 'app/models/voucher-detail';



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
  public products: Product[];
  public productsAdded: Product[];
  public clients: any[];
  public addressClient: any[];
  public isLoading: boolean = true;
  public success: boolean;
  public isLoadingAddressClient: boolean = false;
  public listObjClient: Select[];
  public listObjAddressClient: Select[];
  public listObjProduct: Select[];
  public clientAvailableSearch: boolean = true;
  public productAvailableSearch: boolean = true;
  public totalAmount: number = 0;
  public disableRemoveProduct: boolean;
  public displayedColumns: string[] = ['sku', 'name', 'netoprice','check'];
  public dataSource: any;

  constructor(
    private _formBuilder: FormBuilder,
    private productsService: ProductsService,
    private clientsService: ClientsService,
    private ordersService: OrdersService,
    public router: Router,
    public dialogRef: MatDialogRef<WindowModalComponent>,
    private fuseUtilsService: FuseUtilsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.typeModal = Modal;
  }

  ngOnInit(): void {
    this.disableRemoveProduct = true;
    this.productsAdded = [];
    if (this.data.type === this.typeModal.newOrder) {
      this.loadData();
    }
    if (this.data.type === this.typeModal.newItem) {
      this.loadItems();
    }
    this.initForm();
  }
  itemSelected(val: MatCheckboxChange, sku: string){
    console.log('check ', val.checked, sku)
    if (val.checked) {
      this.products.forEach(product => {
        if (product.sku === sku) {
          this.productsAdded.push(product);
        }
      });
    }else{
      this.productsAdded = this.productsAdded.filter( product => product.sku !== sku);
    }
  }
  loadItems(){
    this.productsService.getListProducts().subscribe(resp=>{
      let listItemsTable: any[]=[];
      let voucherDetail: VoucherDetail[] = (this.data.voucherDetail as VoucherDetail[]);
      
      if (resp.ok) {
        this.products = resp.data;
        this.products.forEach(product=>{
         const val =  {
           id: product._id,
           sku: product.sku,
           name: product.name,
           netoprice: product.netoprice,
           selected: this.verifyItemSelected(voucherDetail, product.sku)
          }
          listItemsTable.push(val);
        });
        this.dataSource = listItemsTable;
        this.isLoading = false;
      }
    });
  }
  verifyItemSelected(voucherDetail: VoucherDetail[], sku: string): boolean{
    //console.log('voucherDetail modal', voucherDetail, sku)
    let exist: boolean = false;
    voucherDetail.forEach(voucher => {
      if (voucher.sku === sku) {
        exist = true;
      }
    });
    return exist;
  }
  async loadData(): Promise<void> {
    let resp1: any;
    let resp2: any;
    this.products = [];
    this.clients = [];
    this.listObjClient = [];
    this.listObjProduct = [];
    this.listObjAddressClient = [];
    this.success = false;
    resp1 = await this.productsService.getListProducts();
    resp2 = await this.clientsService.listarClientes();

    if (resp1.ok && resp2.ok) {
      //console.log(resp2)
      // Get the products and clients
      this.products = this.formatProduct(resp1.data);
      this.clients = this.formatClient(resp2.data);
      this.isLoading = false;
      if (this.clients.length > 0) {
        this.clients.forEach(element => {
          this.listObjClient.push({
            id: element.id,
            label: element.fullName,
            data:
            {
              address: element.address
            }
          });
        });
      }
      if (this.products.length > 0) {
        this.products.forEach(element => {
          this.listObjProduct.push({
            id: element._id as string,
            label: element.name,
            data:
            {
              sku: element.sku,
              price: element.grossPrice
            }
          });
        });
      }
      this.addProduct();
      //console.log(' this.products ',  this.products, this.clients )

      this.orderForm.valueChanges.subscribe(val => {
        this.calculateTotalAmmount();
      });
    }
  }
  objClientSelected(objClient: Select) {
    const { address } = objClient.data;
    this.orderForm.patchValue({
      clientSelected: objClient.id as string
    });
    this.consultAddressClient(address);
  }

  consultAddressClient(address: Array<any>) {
    this.addressClient = [];
    this.listObjAddressClient = [];

    this.addressClient = this.formatAddressClient(address);
    if (this.addressClient.length > 0) {
      this.addressClient.forEach(element => {
        this.listObjAddressClient.push({
          id: element.id,
          label: element.address
        });
      });
    }
  }

  formatAddressClient(AddressClientRaw) {
    let list: any[] = [];
    AddressClientRaw.forEach(element => {
      list.push({
        id: element._id,
        address: element.address
      });
    });
    return list;


  }

  objProductSelected(objProduct: Select, i: number) {
    this.productsControls[i].patchValue({
      product: objProduct,
      price: objProduct.data.price.toFixed(2)

    });
    // console.log('precioo', objProduct.data.price.toFixed(2))
    // this.calculateTotalAmmount();
  }
  objAddressSelected(objProduct: Select) {
    this.orderForm.patchValue({
      address: objProduct.id
    });
  }

  calculateTotalAmmount(): void {
    let cal: number = 0;
    this.totalAmount = 0;
    this.productsForm.value.forEach((productForm, index) => {

      if (productForm.product.data) {
        cal = productForm.quantity * productForm.product.data.price;
        this.totalAmount += cal;
      }
    });
  }

  initForm(): void {
    this.orderForm = this._formBuilder.group({
      clientSelected: new FormControl(null, Validators.required),
      address: new FormControl('', Validators.required),
      products: new FormArray([]),
    });
  }
  get productsForm() {
    return this.orderForm.get('products') as FormArray;
  }
  addProduct(): void {
  //  console.log('se agrego rpdocuto')
    const formProduct = this.createProductForm();
    this.productsForm.push(formProduct);
    this.verifyQuantityLot();
  }
  removeProduct(): void {
    this.productsForm.removeAt(this.productsForm.length - 1);
    this.verifyQuantityLot();
  }
  addItem(): void{
    console.log(' this.productsAdded ',  this.productsAdded )
  }
  verifyQuantityLot() {
    if (this.productsForm.length === 1) {
      this.disableRemoveProduct = true;
    } else {
      this.disableRemoveProduct = false;
    }
  }
  createProductForm(): FormGroup {
    return new FormGroup({
      product: new FormControl('', Validators.required),
      price: new FormControl(),
      quantity: new FormControl(1, Validators.required)
    });
  }
  get productsControls() {
    return this.productsForm.controls as FormGroup[];
  }

  onNoClick(): void {
    this.listFiles = [];
    this.dialogRef.close(this.listFiles);
  }
  imagenesCargadas(): void {
    this.dialogRef.close(this.listFiles);
  }
  getFilesLoades(files: File[]): void {
    console.log('files', files)
    if (files.length > 0) {
      this.existListFile = true;
      this.listFiles = files;
    } else {
      this.existListFile = false;
      this.listFiles = [];
    }
  }



  formatClient(clientRaw) {
    let lista: any[] = [];
    clientRaw.forEach(element => {
      lista.push({
        id: element.uid,
        fullName: element.full_name.name + ' ' + element.full_name.lastName,
        address: element.billing_address
      });
    });
    return lista;
  }

  formatProduct(productRaw) {
    let lista: any[] = [];
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
  listClientAvailable(val: boolean): void {
    this.clientAvailableSearch = val;
  }
  listProductAvailable(val: boolean): void {
    this.productAvailableSearch = val;
  }
  goToClient(idClient?: string): void {
    if (idClient) {
      this.fuseUtilsService.setIdClient(idClient);
    }

    this.router.navigate(['setting/clients']);
    this.dialogRef.close();
  }
  async createNewOrder(): Promise<void> {
    let idClient: string;
    let address: string;
    let ammount: number = 0;
    let productsList: any[] = [];
    let resp: any;

    idClient = this.orderForm.controls.clientSelected.value
    address = this.orderForm.controls.address.value
    console.log('client', this.orderForm.controls.clientSelected.value)
    console.log('products', this.productsForm.value)
    this.productsForm.value.forEach(productForm => {
      // console.log(productForm.product.id, productForm.quantity)
      productsList.push({
        productId: productForm.product.id,
        sku: productForm.product.data.sku,
        quantity: productForm.quantity,
        price: productForm.product.data.price,
        totalCost: productForm.quantity * productForm.product.data.price
      })
      ammount += productForm.quantity * productForm.product.data.price;
    });
    const body = {
      customer_id: idClient,
      ammount,
      address,
      products: productsList
    }
    console.log('body', body)
    this.isLoading = true;
    resp = await this.ordersService.crearOrden(body);
    if (resp.ok) {
      this.isLoading = false;
      // console.log('se ha reacdo nueva orden')
      this.success = true;
      setTimeout(() => {
        this.dialogRef.close();
      }, 1000);

    }

  }
  /* clientSelected: new FormControl('', Validators.required),
  products: new FormArray([]), */


}
