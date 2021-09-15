import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FileUploaderModule } from './file-uploader/file-uploader.module';
import { WindowModalComponent } from './window-modal/window-modal.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

const COMPONENTS = [WindowModalComponent]

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MatProgressBarModule,
        MatDialogModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule,
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
