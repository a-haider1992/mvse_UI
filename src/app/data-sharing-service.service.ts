import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataSharingServiceService {

  sharedData: any;
  isAnalysis: boolean = false;
  constructor() { }
}
