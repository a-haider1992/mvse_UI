import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ImageBasedSearchService {

  constructor(private http: HttpClient, private location: Location) { }

  performAction(uploadedImages: File[]): Promise<any> {
    // Your service logic here
    // Process the list of uploaded images
    console.log(uploadedImages);
    // for (const image of uploadedImages) {
    //   console.log(image.name);
    //   // You can do further processing with each image (e.g., upload to server)
    // }
    const currentHost = window.location.host; // Add the base URL of your API server here
    // const currentHost = this.location.host;
    // const port = this.location.port;
    // const hostWithPort = (port && port !== '80' && port !== '443') ? `${hostname}:${port}` : hostname;
    const formData = new FormData();
    for (let i = 0; i < uploadedImages.length; i++) {
      formData.append('file', uploadedImages[i]);
    }
    console.log(formData);

    return this.http.post(`http://${currentHost}/multi_modals_search_video_new`, formData)
      .toPromise()
      .catch((error) => {
        console.error('HTTP Error:', error);
        throw error; // Rethrow the error to propagate it to the caller
      });

  }

  analyse_video(videoFile: File[]):Promise<any>{
    const currentHost = window.location.host; // Add the base URL of your API server here
    const formData = new FormData();
    formData.append('file', videoFile[0]);
    console.log(formData);
    return this.http.post(`http://${currentHost}/analyse_video`, formData)
      .toPromise()
      .catch((error) => {
        console.error('HTTP Error:', error);
        throw error; // Rethrow the error to propagate it to the caller
      });
  }

}
