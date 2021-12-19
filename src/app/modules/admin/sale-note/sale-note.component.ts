import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, map, switchMap, takeUntil } from 'rxjs/operators';
import { merge, Observable, Subject } from 'rxjs';
import { SaleNoteService } from './sale-note.service';
import { SaleNote } from '../../../models/sale-note';
import { fuseAnimations } from '@fuse/animations';
import { VoucherDetail } from 'app/models/voucher-detail';

const createLabel = ' (Nueva)';
const editLabel = ' (Editar)';

@Component({
  selector: 'app-sale-note',
  templateUrl: './sale-note.component.html',
  styleUrls: ['./sale-note.component.scss']
})
export class SaleNoteComponent implements OnInit {
  public estados: any = [
    {
      id: '01',
      val: 'activo'
    },
    {
      id: '02',
      val: 'cerrado'
    },
    {
      id: '03',
      val: 'otroo'
    },
  ]
  public salesNotes: SaleNote[]; 
  public salesNoteInput: SaleNote; 
  public salesNotesFiltered: SaleNote[]=[]; 
  public voucherDetailInput: VoucherDetail;
  public successMessage: string;
  public stateLabel: string;
  public panelCreateEditSaleNote: boolean

  public isLoading: boolean;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  searchInputClientControl: FormControl = new FormControl();

  //expresion regular numeros, espacios y letras con tildes
  maskForInput: any = 
    {mask: /^[A-Za-zÁ-ú0-9\s]+$/g
    };
  constructor(
    private saleNoteService: SaleNoteService,
    ) { }

  ngOnInit(): void {
    this.successMessage = '';
    this.panelCreateEditSaleNote = false; //false
  //  this.stateLabel = editLabel;// se debe borrar
    this.loadListSaleNote();
    this.searchInputClientControl.valueChanges
    .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        switchMap((queryInput) => {
            
            this.isLoading = true;
            const query = (queryInput as string).toLowerCase();
          return this.salesNotesFiltered = this.salesNotes.filter((saleNote)=>{
                return (saleNote.client.comercialName as string).toLowerCase().match(query) 
           });
        }),
        map(() => {
            this.isLoading = false;
        })
    )
    .subscribe(); 
  }


  loadListSaleNote(): void{
    this.isLoading = true;
    this.salesNotes = []
    this.salesNotesFiltered = this.salesNotes;

    this.saleNoteService.getListSaleNote().subscribe((resp)=>{
      if (resp.ok) {
       this.salesNotes = resp.data;
       this.salesNotesFiltered = this.salesNotes; 
       this.isLoading = false;
      }
    }); 
  }
  editSaleNote(saleNote: SaleNote): void{
    this.panelCreateEditSaleNote = true;
    this.stateLabel = editLabel;
    this.salesNoteInput = saleNote;
   // console.log('voucherDetail valor', saleNote)
  }
  createSaleNote(): void{
    this.panelCreateEditSaleNote = true;
    this.stateLabel = createLabel;
    this.salesNoteInput = null;
  }
  getBackTolist(): void{
    this.panelCreateEditSaleNote = !this.panelCreateEditSaleNote;
    this.stateLabel = '';
  }
  deleteSaleNote(saleNoteId: string):void{
    console.log('saleNoteId', saleNoteId)
  }
  getIsLoading(value: boolean): void{
      this.isLoading = value;
  }

}
