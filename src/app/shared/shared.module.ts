import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploaderModule } from './file-uploader/file-uploader.module';

const COMPONENTS = []

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FileUploaderModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FileUploaderModule,
        ...COMPONENTS
    ],
    declarations: [
      ...COMPONENTS
    ]
})
export class SharedModule
{
}
