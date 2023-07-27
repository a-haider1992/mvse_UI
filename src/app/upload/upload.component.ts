import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
  selectedImageSrcList: Array<string | ArrayBuffer | null> = [];

  @ViewChild('fileInput') fileInput!: ElementRef;

  onImagesSelected(event: any) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImageSrcList.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  clearImages() {
    this.selectedImageSrcList = [];
    // Reset the file input to clear the selected files
    this.fileInput.nativeElement.value = '';
  }
}
