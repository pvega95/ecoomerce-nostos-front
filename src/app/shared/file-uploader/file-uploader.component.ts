import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent implements OnInit {
  files: File[] = [];
  errorMessage: string = ''; 
  @Input() ratio: string[] = ['1:2', '2:1']
  @Output() filesLoaded = new EventEmitter<File[]>();
  constructor() { }

  ngOnInit(): void {
  }

 
onSelect(event) {
 // console.log(event);
  if(event.contImagesDenied > 0){
    this.errorMessage = 'La(s) imagen(es) no cumplen con el ratio (ancho/alto) de ' + event.ratio[0] + ' y ' + event.ratio[1]
  }else{
    this.errorMessage = '';
  }
  this.files.push(...event.addedFiles);
  this.filesLoaded.emit(this.files);
}

onRemove(event) {
 // console.log(event);
  this.errorMessage = '';
  this.files.splice(this.files.indexOf(event), 1);
  this.filesLoaded.emit(this.files);
}

}
