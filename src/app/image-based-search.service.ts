import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ImageBasedSearchService {

  constructor(private http: HttpClient, private location: Location) { }

  search(_uploadedImages:File[], _uploadedAudios: File[], _keywords: string[], _objects: string[], _sceneSelectedStatus: boolean[]): Promise<any>{
    // Main Endpoint
    const formData = new FormData();
    const currentHost = window.location.host;
    const api_endpoint = `http://${currentHost}/multi_modals_search_video_V2`;
    console.log("Inside service--"+_uploadedImages);
    if(_uploadedImages.length >= 1){
      for (let i = 0; i < _uploadedImages.length; i++) {
        console.log(_uploadedImages[i]);
        formData.append('file', _uploadedImages[i]);
        var file_name = _uploadedImages[i].name.toString()
        formData.append('facenames', file_name);
      }
    }
    if(_uploadedAudios.length >= 1){
      for (let i = 0; i < _uploadedAudios.length; i++) {
        formData.append('file', _uploadedAudios[i]);
        var file_name = _uploadedAudios[i].name.toString()
        formData.append('audionames', file_name);
      }
    }
    if (_keywords.length >= 1){
      for (let i = 0; i < _keywords.length; i++) {
        formData.append('keywords', _keywords[i]);
      }
    }
    if(_objects.length >= 1){
      for (let i = 0; i < _objects.length; i++) {
        formData.append('objectnames', _objects[i]);
      }
    }
    console.log(formData);
    return this.http.post(api_endpoint, formData).toPromise().catch((error) => {
      console.error('HTTP Error:', error);
        throw error; // Rethrow the error to propagate it to the caller
    });
  }

  searchV2(
    _uploadedImages: (File[] | string[]), // Accept either File[] or string[]
    _uploadedAudios: (File[] | string[]), // Accept either File[] or string[]
    _keywords: string[],
    _objects: string[],
    _sceneSelectedStatus: boolean[],
    _selectedScenes: string[],
    _selectedSoundStatus: boolean[],
    _selectedEvents: string[],
  ): Promise<any> {
    // Main Endpoint
    const formData = new FormData();
    const currentHost = window.location.host;
    const api_endpoint = `http://${currentHost}/multi_modals_search_video_V2`;

    console.log("Inside apiV2"+_objects);
    
    // Handle _uploadedImages (Images or Strings)
    if (_uploadedImages && _uploadedImages.length >= 1) {
      for (let i = 0; i < _uploadedImages.length; i++) {
        if (_uploadedImages[i] instanceof File) {
          if(_sceneSelectedStatus[i] === true){
            formData.append('file', _uploadedImages[i]);
            const file_name = (_uploadedImages[i] as File).name.toString();
            formData.append('scenenames', file_name);
          }
          else{
            formData.append('file', _uploadedImages[i]);
            const file_name = (_uploadedImages[i] as File).name.toString();
            formData.append('facenames', file_name);
          }
         
        } else if (typeof _uploadedImages[i] === 'string') {
          formData.append('facenames', _uploadedImages[i] as string);
        }
      }
    }
  
    // Handle _uploadedAudios (Audios or Strings)
    if (_uploadedAudios && _uploadedAudios.length >= 1) {
      for (let i = 0; i < _uploadedAudios.length; i++) {
        if (_uploadedAudios[i] instanceof File) {
          formData.append('file', _uploadedAudios[i]);
          const file_name = (_uploadedAudios[i] as File).name.toString();
          if(_selectedSoundStatus[i] === true){
            formData.append("soundeventfiles", file_name);
          }
          else{
            formData.append('audionames', file_name);
          }
        } else if (typeof _uploadedAudios[i] === 'string') {
          formData.append('audionames', _uploadedAudios[i] as string);
        }
      }
    }
  
    // Handle other parameters (keywords, objects, sceneSelectedStatus)
    if (_keywords.length >= 1) {
      for (let i = 0; i < _keywords.length; i++) {
        formData.append('keywords', _keywords[i]);
      }
    }
    if (_objects.length >= 1) {
      for (let i = 0; i < _objects.length; i++) {
        formData.append('objectnames', _objects[i]);
      }
    }
    if (_selectedScenes.length >= 1){
      for(let i = 0; i < _selectedScenes.length; i++){
        formData.append('scenenames', _selectedScenes[i]);
      }
    }
    if (_selectedEvents.length >= 1){
      for(let i = 0; i < _selectedEvents.length; i++){
        formData.append('eventnames', _selectedEvents[i]);
      }
    }

    console.log(formData);
  
    // Rest of the code remains the same
    console.log(formData);    
    return this.http.post(api_endpoint, formData).toPromise().catch((error) => {
      console.error('HTTP Error:', error);
      throw error; // Rethrow the error to propagate it to the caller
    });
  }
  

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
      var file_name = uploadedImages[i].name.toString()
      formData.append('facenames', file_name);
    }
    console.log(formData);

    return this.http.post(`http://${currentHost}/multi_modals_search_video_V2`, formData)
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
