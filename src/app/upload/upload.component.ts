import { Component, ViewChild, ElementRef, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnDestroy {
  selectedFiles: File[] = [];
  selectedImages: File[] = [];
  selectedVideos: File[] = [];
  selectedAudios: File[] = [];
  objectURLs: string[] = []; // Array to store the object URLs
  selectedStatuses: boolean[] = [];

  constructor() { }

  @ViewChild('fileInput') fileInput!: ElementRef;

  // onImagesSelected(event: any) {
  //   const files: FileList = event.target.files;
  //   for (let i = 0; i < files.length; i++) {
  //     const file = files[i];
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       this.selectedImageSrcList.push(e.target.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedFiles = Array.from(inputElement.files);

      for (let i = 0; i < inputElement.files.length; i++) {
        this.selectedStatuses.push(false);
      };

      // Filter files based on their extensions
      this.selectedImages = this.selectedFiles.filter(file => this.isImageFile(file.name));
      this.selectedVideos = this.selectedFiles.filter(file => this.isVideoFile(file.name));

      if (this.selectedImages.length > 0 && this.selectedVideos.length > 0) {
        alert("Eiher image(s) or video(s) can be choosen!!")
        this.clearImages()
      }

      this.objectURLs = this.selectedFiles.map(file => URL.createObjectURL(file));
    }
  }

  // Function to update the selected status when the checkbox state changes
  updateSelectedStatus(index: number, event: any): void {
    this.selectedStatuses[index] = event.target.checked;
    // alert(this.selectedStatuses[index]);
  }

  isImageFile(fileName: string): boolean {
    return fileName.toLowerCase().endsWith('.jpg')
      || fileName.toLowerCase().endsWith('.jpeg')
      || fileName.toLowerCase().endsWith('.png')
      || fileName.toLowerCase().endsWith('.gif')
      || fileName.toLowerCase().endsWith('.bmp');
  }

  isVideoFile(fileName: string): boolean {
    return fileName.toLowerCase().endsWith('.mp4')
      || fileName.toLowerCase().endsWith('.avi')
      || fileName.toLowerCase().endsWith('.mov')
      || fileName.toLowerCase().endsWith('.wmv')
      || fileName.toLowerCase().endsWith('.mkv');
  }

  ngOnDestroy(): void {
    // Revoke all object URLs in the objectURLs array
    this.objectURLs.forEach(url => URL.revokeObjectURL(url));
  }
  clearImages() {
    this.selectedImages = this.selectedVideos = [];
    // Reset the file input to clear the selected files
    this.fileInput.nativeElement.value = '';
  }
}
