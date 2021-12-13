import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, map, switchMap, takeUntil } from 'rxjs/operators';
import { merge, Observable, Subject } from 'rxjs';
import { SaleNoteService } from './sale-note.service';
import { fuseAnimations } from '@fuse/animations';

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
  public salesNotes: any[]=[]; 
  public salesNotesFiltered: any[]=[]; 
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
    this.panelCreateEditSaleNote = true; //false
    this.stateLabel = editLabel;// se debe borrar
    this.loadListSaleNote();
    this.searchInputClientControl.valueChanges
    .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        switchMap((queryInput) => {
            
            this.isLoading = true;
            const query = (queryInput as string).toLowerCase();
          return this.salesNotesFiltered = this.salesNotes.filter((saleNote)=>{
                return (saleNote.client as string).toLowerCase().match(query) 
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
    this.salesNotes = [
      {
        id: '01',
        client: 'luis',
        document: 'Boleta',
        serie: '45',
        numberdoc:'90',
        totalprice: 322.00
      },
      {
        id: '02',
        client: 'Luz',
        document: 'Factura',
        serie: '405',
        numberdoc:'2560',
        totalprice: 3882.00
      }
    ]
    this.salesNotesFiltered = this.salesNotes;

    this.saleNoteService.getListSaleNote().subscribe((resp)=>{
      if (resp.ok) {
      /*  this.salesNotes = resp.data;
       this.salesNotesFiltered = this.salesNotes; */
       this.isLoading = false;
      }
    }); 
  }
  editSaleNote(idSaleNote: string): void{
    this.panelCreateEditSaleNote = true;
    this.stateLabel = editLabel;
  }
  createSaleNote(): void{
    this.panelCreateEditSaleNote = true;
    this.stateLabel = createLabel;
  }
  getBackTolist(): void{
    this.panelCreateEditSaleNote = !this.panelCreateEditSaleNote;
    this.stateLabel = '';
  }

}
