import { Component } from '@angular/core';

@Component({
  selector: 'app-searched-output',
  templateUrl: './searched-output.component.html',
  styleUrls: ['./searched-output.component.scss']
})
export class SearchedOutputComponent {
  frames: any[] = ["../assets/images/image.png", "../assets/images/image.png", "../assets/images/image.png", "../assets/images/image.png", "../assets/images/image.png", "../assets/images/image.png", "../assets/images/image.png"];
  audios: any[] = ["../assets/audios/0.wav", "../assets/audios/0.wav", "../assets/audios/0.wav"];
  videoList: string[] = [
    '../assets/videos/test2.mp4', '../assets/videos/test3.mp4', '../assets/videos/test2.mp4', '../assets/videos/test2.mp4', '../assets/videos/test2.mp4', '../assets/videos/test2.mp4', '../assets/videos/test2.mp4', '../assets/videos/test2.mp4', '../assets/videos/test2.mp4', '../assets/videos/test6.mp4', '../assets/videos/test6.mp4', '../assets/videos/test6.mp4', '../assets/videos/test6.mp4'
  ];
  
  search(): void{

  }
}
