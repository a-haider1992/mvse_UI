import { Component } from '@angular/core';
import { DataSharingServiceService } from '../data-sharing-service.service';

@Component({
  selector: 'app-searched-output',
  templateUrl: './searched-output.component.html',
  styleUrls: ['./searched-output.component.scss']
})
export class SearchedOutputComponent {

  constructor(private dataSharingService: DataSharingServiceService){}

  frames: any[] = ["../assets/images/image.png", "../assets/images/image.png", "../assets/images/image.png", "../assets/images/image.png", "../assets/images/image.png", "../assets/images/image.png", "../assets/images/image.png"];
  audios: any[] = ["../assets/audios/0.wav", "../assets/audios/0.wav", "../assets/audios/0.wav"];
  videoList: string[] = [
    '../assets/videos/test2.mp4', '../assets/videos/test3.mp4', '../assets/videos/test2.mp4', '../assets/videos/test2.mp4', '../assets/videos/test2.mp4', '../assets/videos/test2.mp4', '../assets/videos/test2.mp4', '../assets/videos/test2.mp4', '../assets/videos/test2.mp4', '../assets/videos/test6.mp4', '../assets/videos/test6.mp4', '../assets/videos/test6.mp4', '../assets/videos/test6.mp4'
  ];

  data: any[] = []

  ngOnInit(): void {
    this.data = this.dataSharingService.sharedData;
    console.log("Inside second component!!");
    console.log(this.data);
  }
  
  search(): void{

  }
}
