import { Component, OnInit, EventEmitter, Output, Input, ViewChild, ContentChildren, QueryList, HostBinding, HostListener, Self, ElementRef } from '@angular/core';
import {NgxDropzoneService, FileSelectResult, RejectedFile} from '../ngx-dropzone.service';
import { coerceBooleanProperty, coerceNumberProperty } from '../helpers';
import { NgxDropzonePreviewComponent } from '../ngx-dropzone-preview/ngx-dropzone-preview.component';

export interface NgxDropzoneChangeEvent {
  source: NgxDropzoneComponent;
  addedFiles: File[];
  rejectedFiles: RejectedFile[];
}
const GRUPO = 1;
const UNIDAD = 2;

@Component({
  selector: 'ngx-dropzone, [ngx-dropzone]',
  templateUrl: './ngx-dropzone.component.html',
  styleUrls: ['./ngx-dropzone.component.scss'],
  providers: [NgxDropzoneService]
})
export class NgxDropzoneComponent {

  constructor(
    @Self() private service: NgxDropzoneService
  ) { }

  /** A list of the content-projected preview children. */
  @ContentChildren(NgxDropzonePreviewComponent, { descendants: true })
  _previewChildren: QueryList<NgxDropzonePreviewComponent>;

  get _hasPreviews(): boolean {
    return !!this._previewChildren.length;
  }

  /** A template reference to the native file input element. */
  @ViewChild('fileInput', { static: true }) _fileInput: ElementRef;

  /** Emitted when any files were added or rejected. */
  @Output() readonly change = new EventEmitter<NgxDropzoneChangeEvent>();

  /** Set the accepted file types. Defaults to '*'. */
  @Input() accept = '*';

  /** Disable any user interaction with the component. */
  @Input()
  @HostBinding('class.ngx-dz-disabled')
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);

    if (this._isHovered) {
      this._isHovered = false;
    }
  }
  private _disabled = false;

  /** Allow the selection of multiple files. */
  @Input()
  get multiple(): boolean {
    return this._multiple;
  }
  set multiple(value: boolean) {
    this._multiple = coerceBooleanProperty(value);
  }
  private _multiple = true;

  /** Set the maximum size a single file may have. */
  @Input()
  get maxFileSize(): number {
    return this._maxFileSize;
  }
  set maxFileSize(value: number) {
    this._maxFileSize = coerceNumberProperty(value);
  }
  private _maxFileSize: number = undefined;

  /** Allow the dropzone container to expand vertically. */
  @Input()
  @HostBinding('class.expandable')
  get expandable(): boolean {
    return this._expandable;
  }
  set expandable(value: boolean) {
    this._expandable = coerceBooleanProperty(value);
  }
  private _expandable: boolean = false;

  /** Open the file selector on click. */
  @Input()
  @HostBinding('class.unclickable')
  get disableClick(): boolean {
    return this._disableClick;
  }
  set disableClick(value: boolean) {
    this._disableClick = coerceBooleanProperty(value);
  }
  private _disableClick = false;

  /** Expose the id, aria-label, aria-labelledby and aria-describedby of the native file input for proper accessibility. */
  @Input() id: string;
  @Input('aria-label') ariaLabel: string;
  @Input('aria-labelledby') ariaLabelledby: string;
  @Input('aria-describedby') ariaDescribedBy: string;

  @HostBinding('class.ngx-dz-hovered')
  _isHovered = false;

  /** Show the native OS file explorer to select files. */
  @HostListener('click')
  _onClick() {
    if (!this.disableClick) {
      this.showFileSelector();
    }
  }

  @HostListener('dragover', ['$event'])
  _onDragOver(event) {
    if (this.disabled) {
      return;
    }

    this.preventDefault(event);
    this._isHovered = true;
  }

  @HostListener('dragleave')
  _onDragLeave() {
    this._isHovered = false;
  }

  @HostListener('drop', ['$event'])
  _onDrop(event) {
    if (this.disabled) {
      return;
    }

    this.preventDefault(event);
    this._isHovered = false;


   this.handleFileDrop(event.dataTransfer.files);

/*     this.sacarTamano(event, GRUPO).then((rs) => {
      console.log('result rs', rs.event, rs.val.height, rs.val.width)  
 
      if(true){
        this.handleFileDrop(event.dataTransfer.files);
  
      }}) */

  }

  showFileSelector() {
    if (!this.disabled) {
      (this._fileInput.nativeElement as HTMLInputElement).click();
    }
  }

   _onFilesSelected(event) {
    let width: number = 0;
    let height: number = 0;
    let result
  
  this.sacarTamano(event, UNIDAD).then((rs) => {
    console.log('result rs', rs.event, rs.val.height, rs.val.width)  
    const files: FileList = rs.event.target.files;
    if(true){
      this.handleFileDrop(files);
      // Reset the native file input element to allow selecting the same file again
      this._fileInput.nativeElement.value = '';

    }


  });  
    // fix(#32): Prevent the default event behaviour which caused the change event to emit twice.
    this.preventDefault(event);
    
  }
  
  async sacarTamano(event: any, tipo: number){
    let result
    const reader = new FileReader();
    console.log('event', event)
    if(tipo === UNIDAD){
      reader.readAsDataURL(event.target.files[0]);
    }
    if(tipo === GRUPO){
      reader.readAsDataURL(event.dataTransfer.files[0]);
    }
    

  const val = await new Promise <{width: number; height: number;}> ( resolve => {
      reader.onload = async (e: any) => {
      result = await this.getImageDimenstion(e.target.result);
          resolve({
            width: result.width,
            height: result.height
          })
              }
    });
    return {event, val} ;
  }



  async  getImageDimenstion(imgUrl): Promise<{width: number; height: number;}> {
    let width1: number = 0;
    let heigh2t: number = 0;

    const { width, height } = await new Promise( resolve => {
    let img = new Image(); 
    img.src = imgUrl;
    img.onload =  (event) => {
         let  loadedImage = event.currentTarget;
         resolve({
          width : loadedImage['width'],
          height : loadedImage['height']
         })
  
    } })
    return {width, height};
 }

  private handleFileDrop(files: FileList) {
    const result = this.service.parseFileList(files, this.accept, this.maxFileSize, this.multiple);
    console.log('los archivos', {
      addedFiles: result.addedFiles,
      rejectedFiles: result.rejectedFiles,
      source: this
    })

    this.change.next({
      addedFiles: result.addedFiles,
      rejectedFiles: result.rejectedFiles,
      source: this
    });
  }

  private preventDefault(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }
}


    /*
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    const x = async ()=> {const val = await new Promise( resolve => {
      reader.onload = async (e: any) => {
      result = await this.getImageDimenstion(e.target.result);
          resolve({
            result
          })
              }
    });
    return val;
  }

  console.log('resultpp', x)   */