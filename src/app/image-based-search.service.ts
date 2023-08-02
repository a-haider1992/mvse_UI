import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImageBasedSearchService {

  constructor(private http: HttpClient) { }

  performAction(uploadedImages: File[]): Promise<any> {
    // Your service logic here
    // Process the list of uploaded images
    console.log(uploadedImages);
    // for (const image of uploadedImages) {
    //   console.log(image.name);
    //   // You can do further processing with each image (e.g., upload to server)
    // }
    const currentHost = 'http://127.0.0.1:8000'; // Add the base URL of your API server here

    const formData = new FormData();
    for (let i = 0; i < uploadedImages.length; i++) {
      formData.append('file', uploadedImages[i]);
    }
    console.log(formData);

    return this.http.post(`${currentHost}/multi_modals_search_video_new`, formData).toPromise();
  }

}
