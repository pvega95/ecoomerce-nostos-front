import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent implements OnInit {
  files: File[] = [];
  errorMessage: string = ''; 
  @Input() ratio: string[] = ['1:2', '2:1']
  constructor() { }

  ngOnInit(): void {
  }

 

onSelect(event) {
  console.log(event);
  this.errorMessage = 'aksjd'
  this.files.push(...event.addedFiles);
}

onRemove(event) {
  console.log(event);
  this.errorMessage = '';
  this.files.splice(this.files.indexOf(event), 1);
}

}
