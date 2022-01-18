import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Status, getStatusStyle, StatusModel } from '../../enums/status.enum';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {
  @Input() estado: string;
  @Output() search: EventEmitter<any> = new EventEmitter<any>();
  public objStyleStatus: StatusModel;
  constructor() { }

  ngOnInit(): void {
   // console.log('Status', this.estado, getStatusStyle(Status.pendiente))
    switch (this.estado) {
      case 'PENDIENTE': {
        this.objStyleStatus = getStatusStyle(Status.pendiente);
        break;
      }
      case 'PAGADO':{
        this.objStyleStatus = getStatusStyle(Status.pagado);
        break;
      }
      case 'ANULADO': {
        this.objStyleStatus = getStatusStyle(Status.anulado);
        break;
      }
        
    }
  }

}
