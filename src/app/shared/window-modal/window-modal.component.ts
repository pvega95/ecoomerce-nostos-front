import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-window-modal',
  templateUrl: './window-modal.component.html',
  styleUrls: ['./window-modal.component.scss']
})
export class WindowModalComponent implements OnInit {
  public existListFile: boolean = false;
  public listFiles: File[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<WindowModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }
  onNoClick(): void {
    this.listFiles = [];
    this.dialogRef.close(this.listFiles);
  }
  imagenesCargadas(): void{
    this.dialogRef.close(this.listFiles);
  }
  getFilesLoades(files: File[]):void{
     console.log('files', files)
     if(files.length > 0){
       this.existListFile = true;
       this.listFiles = files;
     }else{
      this.existListFile = false;
      this.listFiles = [];
     }
  }

}
