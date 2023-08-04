import { Component } from '@angular/core';
import { DataSharingServiceService } from '../data-sharing-service.service';

@Component({
  selector: 'app-searched-output',
  templateUrl: './searched-output.component.html',
  styleUrls: ['./searched-output.component.scss']
})
export class SearchedOutputComponent {

  constructor(private dataSharingService: DataSharingServiceService){}
  selectedImages: any[] = [];

  frames: any[] = ["../assets/images/image.png", "../assets/images/logo.png", "../assets/images/image.png", "../assets/images/logo.png", "../assets/images/logo.png"];
  audios: any[] = ["../assets/audios/0.wav", "../assets/audios/0.wav", "../assets/audios/0.wav", "../assets/audios/0.wav",  "../assets/audios/0.wav", "../assets/audios/0.wav"];
  videoList: string[] = [
    '../assets/videos/test2.mp4', '../assets/videos/test3.mp4', '../assets/videos/test2.mp4', '../assets/videos/test2.mp4', '../assets/videos/test2.mp4', '../assets/videos/test2.mp4', '../assets/videos/test2.mp4', '../assets/videos/test2.mp4', '../assets/videos/test2.mp4', '../assets/videos/test6.mp4', '../assets/videos/test6.mp4', '../assets/videos/test6.mp4', '../assets/videos/test6.mp4'
  ];

  data: any[] = []

  ngOnInit(): void {
    this.data = this.dataSharingService.sharedData;
    // console.log("Inside second component!!");
    console.log(this.data);
  }

  toggleImageSelection(src: string): void {
    const index = this.selectedImages.indexOf(src);
    if (index === -1) {
      this.selectedImages.push(src);
    } else {
      this.selectedImages.splice(index, 1);
    }
  }

  isImageSelected(src: string): boolean {
    return this.selectedImages.includes(src);
  }
  
  search(): void{

  }
}
