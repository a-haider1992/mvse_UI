import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageBasedSearchService {

  constructor() { }

  performAction(uploadedImages: File[]): void {
    // Your service logic here
    // Process the list of uploaded images
    console.log(uploadedImages);
    for (const image of uploadedImages) {
      console.log(image.name);
      // You can do further processing with each image (e.g., upload to server)
    }
  }
}
