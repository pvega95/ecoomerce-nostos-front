import { NgModule } from '@angular/core';
import { NgxDropzoneModule } from './lib/ngx-dropzone.module';
import { FileUploaderComponent } from './file-uploader.component';
import { CommonModule } from '@angular/common';


@NgModule({
    imports: [
        CommonModule,
        NgxDropzoneModule
    ],
    exports: [
        CommonModule,
        FileUploaderComponent
    ],
    declarations: [
        FileUploaderComponent
    ]
})
export class FileUploaderModule
{
}
