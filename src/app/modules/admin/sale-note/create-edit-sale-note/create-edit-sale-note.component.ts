import { Component, Input, OnChanges, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
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
  @Input() minLength: number = 2;
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
    private documentService: DocumentService,
    private paymentDeadlineService: PaymentDeadlineService,
    ) { 
    this.initForm();
  }

  ngOnInit(): void {
    this.loadValues();
   let cadena: string ='03,05,02'
    const variable: any[] = cadena.split(',');
   
    const x = variable.find(val=> val == '026') || null
    console.log('valor x',x)
    
  }
  backTolistSaleNote(){
    this.backTolist.emit();
  }
  loadValues(){
    this.isLoading.emit(true);
    this.listObjDocuments = [];
    this.listObjCompanies = [];
    this.listObjPaymentDeadlines = [];
    this.companies = [];
    this.documents = [];
    this.paymentDeadlines = [];
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

        this.listObjDocuments = FuseUtilsService.formatOptionsDocument(this.documents);
        this.listObjCompanies = FuseUtilsService.formatOptionsCompany(this.companies);
        this.listObjPaymentDeadlines = FuseUtilsService.formatOptionsPaymentDeadline(this.paymentDeadlines);
      
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
        numberdocument      : ['', [Validators.required]],
        paymentdeadline     : ['', [Validators.required]],
        status              : ['', [Validators.required]],
        reference           : ['', [Validators.required]],
        note                : ['', [Validators.required]],
        dateissue           : ['', [Validators.required]],
        datemodification    : ['', [Validators.required]],    
    });
    this.selectedSaleNoteForm.controls.serie.disable();
    this.selectedSaleNoteForm.controls.numberdocument.disable();
    this.selectedSaleNoteForm.controls.dateissue.disable();
    this.selectedSaleNoteForm.controls.datemodification.disable();
  }

}
