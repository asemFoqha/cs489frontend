import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-image-viewer-dialog',
  standalone: true,
  imports: [],
  template: ` <img [src]="src" alt="image" /> `,
  styles: [
    `
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    `,
  ],
})
export class ImageViewerDialogComponent {
  src = inject(MAT_DIALOG_DATA);
}
