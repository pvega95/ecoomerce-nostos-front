import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Modal } from '../../enums/modal.enum';
import { ProductsService } from '../../modules/admin/setting/products/products.service';
import { ClientsService } from '../../modules/admin/setting/clients/clients.service';



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

  constructor(
    private _formBuilder: FormBuilder,
    private productsService: ProductsService,
    private clientsService: ClientsService,
    public dialogRef: MatDialogRef<WindowModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.typeModal = Modal;
   }

  ngOnInit(): void {
   console.log('data', Modal.loading)
   this.loadData();
    this.initForm();
  }

async  loadData(): Promise<void>{
  let resp1: any;
  let resp2: any;
  this.products = [];
  resp1 = await this.productsService.listarProductos();
  resp2 = await this.clientsService.listarClientes();

    if (resp1.ok && resp2.ok) {
      // Get the products
      this.products = resp1.data;
      this.clients = resp2.data;
      this.isLoading = false;
      console.log(' this.products ',  this.products, this.clients )
    }
  }

  initForm(): void{
    this.orderForm = this._formBuilder.group({
      productid: [''],
    });
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

}
