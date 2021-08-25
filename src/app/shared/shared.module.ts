import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FileUploaderModule } from './file-uploader/file-uploader.module';
import { WindowModalComponent } from './window-modal/window-modal.component';

const COMPONENTS = [WindowModalComponent]

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MatDialogModule,
        MatIconModule,
        MatButtonModule,
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
      ...COMPONENTS,
      
    ]
})
export class SharedModule
{
}
