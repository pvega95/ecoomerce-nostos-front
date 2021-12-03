import { Component, OnInit } from '@angular/core';
import { DocumentSerieService } from './document-series.service';
import { CompanyService } from '../company/company.service';
import { DocumentService } from '../document/document.service'
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { combineLatest, merge, Observable, Subject } from 'rxjs';
import { debounceTime, map, switchMap, takeUntil } from 'rxjs/operators';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Select } from "app/models/select";
import { FuseUtilsService } from '../../../../../@fuse/services/utils/utils.service';
import { fuseAnimations } from '@fuse/animations';
import { forkJoin } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { DocumentSeries } from '../../../../models/document-series';
import { Document } from '../../../../models/document';
import { Company } from '../../../../models/company';

@Component({
  selector: 'app-document-series',
  templateUrl: './document-series.component.html',
  styles: [
    /* language=SCSS */
    `
    .inventory-grid {
        grid-template-columns: 48px auto 40px;

        @screen sm {
            grid-template-columns: 48px auto 112px 72px;
        }

        @screen md {
            grid-template-columns: 16rem 12rem 15rem 6rem 6rem;
        }

        @screen lg {
            grid-template-columns: 16rem 12rem 15rem 6rem 6rem;
        }
          }
      `
      ],
   animations : fuseAnimations,
})
export class DocumentSeriesComponent implements OnInit {
  public documentSeries: DocumentSeries[] = [];
  public documentSeriesAux: DocumentSeries[] = [];
  public documentSeriesFormat: DocumentSeries[] = [];
  public documents: Document[] = [];
  public companies: Company[] = [];
  public listObjDocuments: Select[];
  public listObjCompanies: Select[];
  public isLoading: boolean;
  documentSeriesFiltered: any[] = [];
  searchInputControl: FormControl = new FormControl();
  selectedDocumentSerie: any = null;
  selectedDocumentSeriesForm: FormGroup;
  flashMessage: boolean;
  seeMessage: boolean = false;
  successMessage: string;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  //expresion regular numeros, espacios y letras con tildes
  maskForInput: any = 
  {mask: /^[A-Za-zÁ-ú0-9\s]+$/g
  };

  constructor(
    private documentSerieService: DocumentSerieService,
    private companyService: CompanyService,
    private documentService: DocumentService,
    private _formBuilder: FormBuilder,
    private _fuseConfirmationService: FuseConfirmationService,
    ) { }

  ngOnInit(): void {
    this.successMessage = '';
    this.loadListDocumentSeries();
    this.searchInputControl.valueChanges
    .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        switchMap((queryInput) => {
            this.closeDetails();
            this.isLoading = true;
            const query = (queryInput as string).toLowerCase();
          return this.documentSeriesFiltered = this.documentSeries.filter((documentSerie)=>{
                return (documentSerie.series as string).toLowerCase().match(query) 
           });
        }),
        map(() => {
            this.isLoading = false;
        })
    )
    .subscribe(); 
  }
  loadListDocumentSeries(): void{
    this.isLoading = true;
    this.listObjDocuments = [];
    this.listObjCompanies = [];
    forkJoin (
      [
        this.documentSerieService.getListDocumentSerie(),
        this.documentService.getListDocument(),
        this.companyService.getListCompany(),
      ],
      )
      .subscribe(([requestDocumentSerie, requestDocument, requestCompany]) => {
       if (requestDocumentSerie.ok && requestDocument.ok && requestCompany.ok) {
          this.documentSeries = requestDocumentSerie.data;
          this.documentSeriesFiltered =  this.documentSeries;
          this.documents = requestDocument.data;
          this.companies = requestCompany.data;
          this.listObjDocuments = this.formatOptionsDocument(this.documents);
          this.listObjCompanies = this.formatOptionsCompany(this.companies);
          this.isLoading = false;
       } 
    
      });
    
  }
  objDocumentSelected(IdDocument: string): void{
    this.selectedDocumentSeriesForm.patchValue({
      document: IdDocument
    })
  }
  objCompanySelected(IdCompany: string): void{
    this.selectedDocumentSeriesForm.patchValue({
      company: IdCompany
    })

  }
  formatOptionsDocument(listObjRaw: any[]): Select[]{
    let listObj: Select[] = [];
    listObjRaw.forEach(objRaw => {
        listObj.push({
            id: objRaw._id as string,
            label: objRaw.description
        })
    });
    return listObj;
  }
  formatOptionsCompany(listObjRaw: any[]): Select[]{
    let listObj: Select[] = [];
    listObjRaw.forEach(objRaw => {
        listObj.push({
            id: objRaw._id as string,
            label: objRaw.comercialName
        })
    });
    return listObj;
  }
 /*  findDocumentById(idDocument: string): Document{
    let documentFound: Document = null;
    if (this.documents.length > 0) {
       documentFound = this.documents.find((document)=> document._id == idDocument ) || null;
    }
    return documentFound;
  }
  findCompanyById(idCompany: string): Company{
    let companyFound: Company = null;
    if (this.companies.length > 0) {
      companyFound = this.companies.find((company)=> company._id == idCompany ) || null;
    }
    return companyFound;
  } */


  toggleDetails(documentSerieId: string): void
  {
      // If the company is already selected...
      if (this.selectedDocumentSerie ) {
        if (this.selectedDocumentSerie._id === documentSerieId )
        {
            // Close the details
            this.closeDetails();
            return;
        }
      }
      this.successMessage = '';
      this.seeMessage = false;
      this.initForm();
    

      // Get the company by id
      const selectedDocumentSerie = this.documentSeries.find(item => item._id === documentSerieId)  || null;
      console.log('selectedDocumentSerie', selectedDocumentSerie)
      this.selectedDocumentSerie = selectedDocumentSerie;
      if(selectedDocumentSerie._id){
          this.selectedDocumentSeriesForm.patchValue({
            id: selectedDocumentSerie._id,
            document: selectedDocumentSerie.document._id,
            series: selectedDocumentSerie.series,
            company: selectedDocumentSerie.company._id,
            currentCorrelative: selectedDocumentSerie.currentCorrelative,            
          });

      }else{
          this.selectedDocumentSeriesForm.patchValue({
              id: -1,
              document: '',
              series: '',
              company: '',
              currentCorrelative: 0
            });

      }

  }

  initForm() {
    this.selectedDocumentSeriesForm = this._formBuilder.group({
        id                  : [''],
        document            : ['', [Validators.required]],
        series              : ['', [Validators.required, Validators.minLength(1), FuseUtilsService.sinEspaciosEnBlanco]],
        company             : ['',[Validators.required]],
        currentCorrelative  : ['',[Validators.required]],
    });
  }


  closeDetails(): void
  {
      this.selectedDocumentSerie = null;
  }



  createDocumentSerie(): void{
  /*   this.documentSeries.unshift(
      {
        document: '',
        series: '',
        company: '',
        currentCorrelative: 0
      }); */
   // FuseUtilsService.convertFromValueToNumber()
  } 
  createNewdocumentSerie(): void{
    const body = {
      document: this.selectedDocumentSeriesForm.get('document').value,
      series: this.selectedDocumentSeriesForm.get('series').value,
      company: this.selectedDocumentSeriesForm.get('company').value,
      currentCorrelative: 0
    }
    console.log('body', body)
  }
  updateSelectedDocumentSerie(): void{
    const body: Company = {
      ruc: this.selectedDocumentSeriesForm.get('ruc').value,
      comercialName: this.selectedDocumentSeriesForm.get('comercialName').value,
      department: this.selectedDocumentSeriesForm.get('department').value,
      province: this.selectedDocumentSeriesForm.get('province').value,
      district: this.selectedDocumentSeriesForm.get('district').value,
    } 
    const id = this.selectedDocumentSeriesForm.get('id').value
    this.isLoading = true;
 /*    if (body) {
      this.documentSerieService.updateDocumentSerie(id, body).subscribe((resp)=>{
        this.flashMessage = resp.success;
        this.seeMessage = true;
        if (resp.success) {
            this.successMessage = resp.message;
            this.isLoading = false;
            setTimeout(()=>{  // 2 segundo se cierra 
                this.seeMessage = false;
                }, 2000);
            setTimeout(()=>{  
                this.loadListDocumentSeries();
                this.closeDetails();
                }, 1000); 
        }
      });
    } */

  }
  deleteSelectedDocumentSerie(): void{
    const confirmation = this._fuseConfirmationService.open({
      title  : 'Eliminar documento serie "'+ this.selectedDocumentSeriesForm.get('comercialName').value+ '"',
      message: '¿Estás seguro(a) que quieres eliminar este documento serie?. Esta acción no puede deshacerse!',
      actions: {
          confirm: {
              label: 'Eliminar'
          }
      }
    });
    confirmation.afterClosed().subscribe( result => {
      if ( result === 'confirmed' ){
        const id = this.selectedDocumentSeriesForm.get('id').value
        this.isLoading = true;
        this.documentSerieService.deleteDocumentSerie(id).subscribe((resp)=>{
            this.flashMessage = resp.success;
            this.seeMessage = true;
            if (resp.success) {
                this.successMessage = resp.message;
                this.isLoading = false;
                setTimeout(()=>{  // 2 segundo se cierra 
                    this.seeMessage = false;
                    }, 2000);
                setTimeout(()=>{  
                    this.loadListDocumentSeries();
                    this.closeDetails();
                    }, 1000); 
            }
          });
        }
      });

  }

}
