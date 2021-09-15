import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { take, takeUntil } from 'rxjs/operators';
import { ReplaySubject, Subject } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-select-search',
  templateUrl: './select-search.component.html',
  styleUrls: ['./select-search.component.scss']
})
export class SelectSearchComponent implements OnInit, OnDestroy, AfterViewInit {
  
  @Input() listObj: any[];
  @Input() id: any;
  @Input() placeholderLabel: string;
  @Input() noEntriesFoundLabel: string;
  @Input() placeholder: string;
  @Output() objSelectedOut = new EventEmitter<any>();

  public objSelected: FormControl = new FormControl();
  /** control for the MatSelect filter keyword */
  public objFilterCtrl: FormControl = new FormControl();
  /** list of banks filtered by search keyword */
  public filteredObjs: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();


  constructor() { }

  ngOnInit(): void {

    // carga lista de clientes
    this.filteredObjs.next(this.listObj.slice());
    // listen for search field value changes
    this.objFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterObjs();
    });
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  
  /**
   * Sets the initial value after the filteredObjs are loaded initially
   */
   protected setInitialValue() {
    this.filteredObjs
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredObjs are loaded initially
        // and after the mat-option elements are available
        this.singleSelect.compareWith = (a: any, b: any) => a && b && a.id === b.id;
      });
  }

  protected filterObjs() {
    if (!this.listObj) {
      return;
    }
    // get the search keyword
    let search = this.objFilterCtrl.value;
    if (!search) {
      this.filteredObjs.next(this.listObj.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the 
    this.filteredObjs.next(
      this.listObj.filter(obj => obj.label.toLowerCase().indexOf(search) > -1)
    );
    if (this.listObj.filter(obj => obj.label.toLowerCase().indexOf(search) > -1).length == 0 ) {
      console.log('no hay nada')
    }else{
      console.log('coinicdencia')
    }
  }
  selectObj(objSelected){
   // console.log('obj slected', objSelected.value)
    this.objSelectedOut.emit(objSelected.value);
  }



}
