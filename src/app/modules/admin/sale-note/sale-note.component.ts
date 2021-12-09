import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sale-note',
  templateUrl: './sale-note.component.html',
  styleUrls: ['./sale-note.component.scss']
})
export class SaleNoteComponent implements OnInit {

  public isLoading: boolean;

  searchInputControl: FormControl = new FormControl();
  constructor() { }

  ngOnInit(): void {
  }
  createSaleNote(): void{

  }

}
