import { Component, Input, OnChanges, EventEmitter, OnDestroy, OnInit, Output, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseUtilsService } from '@fuse/services/utils/utils.service';
import { forkJoin } from 'rxjs';
import { Select } from "app/models/select";
import { Company } from '../../../../models/company';
import { Document } from '../../../../models/document';
import { PaymentDeadline } from '../../../../models/payment-deadline';
import { CompanyService } from '../../setting/company/company.service'
import { DocumentService } from '../../setting/document/document.service'
import { PaymentDeadlineService } from '../../setting/payment-deadline/payment-deadline.service'
import { SaleNote } from 'app/models/sale-note';
import { WindowModalComponent } from '../../../../shared/window-modal/window-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Modal } from '../../../../enums/modal.enum';
//import {  } from '../../setting/'

@Component({
  selector: 'app-create-edit-sale-note',
  templateUrl: './create-edit-sale-note.component.html',
  styleUrls: ['./create-edit-sale-note.component.scss']
})
export class CreateEditSaleNoteComponent implements OnInit {
  public voucher: any[] = [
    {
      sku: 'askkas',
      productname: 'gaseosea inka cola',
      quantity: 322,
      netprice: 25.00,
      igvprice: 4.00 ,
      totalprice: 29.00
    },
    {
      sku: 'raaatgs',
      productname: 'paneton tottus',
      quantity: 30,
      netprice: 5.13,
      igvprice: 2.30,
      totalprice: 38.20
    },
    {
      sku: 'koiff',
      productname: 'silla gamer',
      quantity: 69,
      netprice: 10.20,
      igvprice: 63.20,
      totalprice: 123.50
    },
    {
      sku: 'jhiys',
      productname: 'teclado',
      quantity: 20,
      netprice: 40.20,
      igvprice: 10.26,
      totalprice: 50.20
    },
  ]
    
      
  
  public companies: Company[];
  public documents: Document[];
  public paymentDeadlines: PaymentDeadline[];
  public listObjDocuments: Select[];
  public listObjCompanies: Select[];
  public listObjPaymentDeadlines: Select[];
  @Input() salesNoteInput: SaleNote = null;
  @Output() isLoading: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() backTolist: EventEmitter<any> = new EventEmitter<any>();
  selectedSaleNoteForm: FormGroup;
    //expresion regular numeros, espacios y letras con tildes
    maskForInput: any = 
    {mask: /^[A-Za-zÁ-ú0-9\s]+$/g
    };

  constructor(
    private _formBuilder: FormBuilder,
    private companyService: CompanyService,
    public dialog: MatDialog,
    private fuseUtilsService: FuseUtilsService,
    private documentService: DocumentService,
    private paymentDeadlineService: PaymentDeadlineService,
    ) { 
    this.initForm();
    
  }

  ngAfterViewInit() {
    setTimeout(() => {
     
    }, 0);
   }
  ngOnInit(): void {
    this.loadValues();    
  }
  backTolistSaleNote(){
    this.backTolist.emit();
  }
  loadValues(){   
    this.listObjDocuments = [];
    this.listObjCompanies = [];
    this.listObjPaymentDeadlines = [];
    this.companies = [];
    this.documents = [];
    this.paymentDeadlines = [];
    setTimeout(() => {
      this.isLoading.emit(true);
    }, 0);
    forkJoin(
      [
        this.companyService.getListCompany(),
        this.documentService.getListDocument(),
        this.paymentDeadlineService.getListPaymentDeadline()
      ]
    ).subscribe(([companyResponse, documentResponse, paymentDeadlineResponse])=>{
      if (companyResponse.ok && documentResponse.ok && paymentDeadlineResponse.ok) {
        this.companies = companyResponse.data;
        this.documents = documentResponse.data;
        this.paymentDeadlines = paymentDeadlineResponse.data;

      
        console.log('this.salesNoteInput  value', this.salesNoteInput)
        this.selectedSaleNoteForm.patchValue({
          id:  this.salesNoteInput?._id || '-1',
          client: this.salesNoteInput?.client.comercialName || '',          
          company: this.salesNoteInput?.document.company || '',  
          document: this.salesNoteInput?.document.document || '',           
          serie: this.salesNoteInput?.serie || '',
          documentNumber: this.salesNoteInput?.documentNumber || '',
          paymentdeadline: this.salesNoteInput?.paymentDeadline._id || '',
          status: this.salesNoteInput?.status || '',           
          reference: this.salesNoteInput?.reference || '',         
          note: this.salesNoteInput?.note || '',              
          registryDate: this.salesNoteInput ? this.fuseUtilsService.formatDateOut(this.salesNoteInput.registryDate) : '',        
          updatedAt: this.salesNoteInput ? this.fuseUtilsService.formatDateOut(this.salesNoteInput.updatedAt) : '',   
        });
        
        this.listObjDocuments = FuseUtilsService.formatOptionsDocument(this.documents);
        this.listObjCompanies = FuseUtilsService.formatOptionsCompany(this.companies);
        this.listObjPaymentDeadlines = FuseUtilsService.formatOptionsPaymentDeadline(this.paymentDeadlines);
        console.log('documento ', this.selectedSaleNoteForm.get('document').value, this.listObjDocuments )
        this.isLoading.emit(false);
      }
    });
  }
  objCompanySelected(objCompany: Select){
  //  console.log('value company selected', value.label)
  }
  objDocumentSelected(objDocument: Select){
  //  console.log('value documento selected', value)
  }
  objPaymentDeadlineSelected(objDocument: Select){

  }

  initForm() {
    this.selectedSaleNoteForm = this._formBuilder.group({
        id                  : [''],
        client              : ['', [Validators.required]],
        company             : ['', [Validators.required]],
        document            : ['', [Validators.required]],
        serie               : ['', [Validators.required, Validators.minLength(1), FuseUtilsService.sinEspaciosEnBlanco]],
        documentNumber      : ['', [Validators.required]],
        paymentdeadline     : ['', [Validators.required]],
        status              : ['', [Validators.required]],
        reference           : ['', [Validators.required]],
        note                : ['', [Validators.required]],
        registryDate        : ['', [Validators.required]],
        updatedAt           : ['', [Validators.required]],    
    });
    this.selectedSaleNoteForm.controls.serie.disable();
    this.selectedSaleNoteForm.controls.documentNumber.disable();
    this.selectedSaleNoteForm.controls.registryDate.disable();
    this.selectedSaleNoteForm.controls.updatedAt.disable();
  }
  addItem(): void{
    const dialogRef = this.dialog.open(WindowModalComponent, {
      width: '42rem',
      height: '30rem',
      data: {
          type: Modal.newOrder
        },
    disableClose: true
    });
    dialogRef.afterClosed().subscribe( result => {
      
    });

  }
  cancelSelectedSaleNote(): void{

  }
  createSaleNote(): void{

  }
  saveSelectedSaleNote():void{
    
  }

}
