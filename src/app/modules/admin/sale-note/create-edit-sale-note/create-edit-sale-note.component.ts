import { Component, Input, OnChanges, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';


@Component({
  selector: 'app-create-edit-sale-note',
  templateUrl: './create-edit-sale-note.component.html',
  styleUrls: ['./create-edit-sale-note.component.scss']
})
export class CreateEditSaleNoteComponent implements OnInit {
  @Input() minLength: number = 2;
  @Output() backTolist: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }
  backTolistSaleNote(){
    this.backTolist.emit();
  }

}
