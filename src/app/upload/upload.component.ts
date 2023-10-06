import { Component, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ImageBasedSearchService } from '../image-based-search.service';
import { DataSharingServiceService } from '../data-sharing-service.service';
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
  showProgressBar: boolean = false;
  applyBlurEffect: boolean = false;

  ngOnInit() {
    // this.showProgressBarWithBlur();
  }

  // Function to show the progress bar and apply blur effect
  showProgressBarWithBlur() {
    console.log("Progress bar show called!!");
    this.showProgressBar = true;
    this.applyBlurEffect = true;
  }

  // Function to hide the progress bar and remove blur effect
  hideProgressBar() {
    this.showProgressBar = false;
    this.applyBlurEffect = false;
  }

  constructor(private router: Router, private imageBasedSearch: ImageBasedSearchService, private dataSharingService: DataSharingServiceService) { }

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
      this.selectedAudios = this.selectedFiles.filter(file => this.isAudioFile(file.name));

      if (this.selectedImages.length > 0 && this.selectedVideos.length > 0) {
        alert("Eiher image(s) or video(s) can be choosen!!")
        this.clearImages()
      }

      if (this.selectedImages.length == 0 && this.selectedAudios.length == 0 && this.selectedVideos.length == 0) {
        alert("Invalid file type!!")
      }

      this.objectURLs = this.selectedFiles.map(file => URL.createObjectURL(file));
    }
  }

  updateSelectedStatus(index: number, event: any): void {
    // Toggle the checkbox status in selectedStatuses array
    this.selectedStatuses[index] = event.target.checked;
  
    // // Get the current file and its name
    // const file = this.selectedImages[index];
    // const fileName = file.name;
    // console.log(fileName);
  
    // // Split the file name into parts
    // const parts = fileName.split(".");
    
    // if (parts.length === 2) {
    //   const nameWithoutExtension = parts[0];
    //   const extension = parts[1];

    //   console.log(parts);
  
    //   // Check if the file name already contains "_object" or "_face"
    //   const isObject = nameWithoutExtension.endsWith("_obj");
    //   const isFace = nameWithoutExtension.endsWith("_fac");
  
    //   // Determine the modifier based on the checkbox status
    //   const modifier = this.selectedStatuses[index] ? "_obj" : "_fac";
  
    //   // Create the modified name if it doesn't already contain the modifier
    //   let modifiedName = nameWithoutExtension;
    //   if (isObject || isFace) {
    //     modifiedName = nameWithoutExtension.slice(0, -4); // Remove the existing modifier
    //   }
    //   modifiedName += modifier + "." + extension;

    //   console.log(modifiedName);
  
    //   // Create a new File object with the modified name
    //   const modifiedFile = new File([file], modifiedName);
  
    //   // Update the selectedImages array with the modified file
    //   this.selectedImages[index] = modifiedFile;
    //   this.selectedStatuses[index] = true;
    // } else {
    //   console.error("Invalid image name format");
    // }
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

  isAudioFile(fileName: string): boolean {
    return fileName.toLowerCase().endsWith('.wav')
      || fileName.toLowerCase().endsWith('.wav');
  }

  ngOnDestroy(): void {
    // Revoke all object URLs in the objectURLs array
    this.objectURLs.forEach(url => URL.revokeObjectURL(url));
  }
  clearImages() {
    this.selectedImages = this.selectedVideos = this.selectedAudios = [];
    // Reset the file input to clear the selected files
    this.fileInput.nativeElement.value = '';
  }

  // goToSecondComponent(): void {
  //   this.showProgressBarWithBlur();
  //   if (this.selectedFiles.length == 0) {
  //     alert("Please upload file(s)!")
  //     this.hideProgressBar();
  //   }
  //   else {
  //     this.imageBasedSearch.performAction(this.selectedImages).then(response => {
  //       console.log(response);
  //       const data = response.location;
  //       this.dataSharingService.sharedData = data;
  //       this.hideProgressBar();
  //       this.router.navigateByUrl('/searchResults');
  //     }).catch(error => { console.error(error) });
  //     this.hideProgressBar();
  //   }
  // }
  goToSecondComponent(): void {
    this.showProgressBarWithBlur();

    if (this.selectedFiles.length == 0) {
      alert("Please upload file(s)!");
      this.hideProgressBar();
      return;
    }

    // Use setTimeout to create a delay and allow the progress bar to be displayed
    setTimeout(() => {
      this.imageBasedSearch.performAction(this.selectedImages)
        .then(response => {
          console.log(response);
          const data = response.location;
          this.dataSharingService.sharedData = data;
          this.hideProgressBar();
          this.router.navigateByUrl('/searchResults');
        })
        .catch(error => {
          console.error(error);
          this.hideProgressBar(); // Ensure the progress bar is hidden in case of an error
        });
    }, 100); // Adjust the delay time (milliseconds) as needed, e.g., 100ms
  }

}
