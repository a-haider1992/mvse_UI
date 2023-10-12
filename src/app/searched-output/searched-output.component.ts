import { Component } from '@angular/core';
import { DataSharingServiceService } from '../data-sharing-service.service';
import { VideoDownloadService } from '../video-download.service';

@Component({
  selector: 'app-searched-output',
  templateUrl: './searched-output.component.html',
  styleUrls: ['./searched-output.component.scss']
})
export class SearchedOutputComponent {

  constructor(private dataSharingService: DataSharingServiceService, private videoDownloadService: VideoDownloadService) { }
  selectedImages: any[] = [];

  frames: any[] = ["../assets/images/image.png", "../assets/images/logo.png", "../assets/images/image.png", "../assets/images/logo.png", "../assets/images/logo.png"];
  audios: any[] = ["../assets/audios/0.wav", "../assets/audios/0.wav", "../assets/audios/0.wav", "../assets/audios/0.wav", "../assets/audios/0.wav", "../assets/audios/0.wav"];
  videoList: string[] = [
    '../assets/videos/test2.mp4', '../assets/videos/test3.mp4', '../assets/videos/test2.mp4', '../assets/videos/test2.mp4', '../assets/videos/test2.mp4', '../assets/videos/test2.mp4', '../assets/videos/test2.mp4', '../assets/videos/test2.mp4', '../assets/videos/test2.mp4', '../assets/videos/test6.mp4', '../assets/videos/test6.mp4', '../assets/videos/test6.mp4', '../assets/videos/test6.mp4'
  ];
  // To store posters returned by API call
  posterList: string[] = [];

  data: any[] = []
  source_video: string = '';
  startTime: any = 0;
  showVideoOverlay = false;

  ngOnInit(): void {
    this.data = this.dataSharingService.sharedData;
    if (Array.isArray(this.data)){
      console.log(this.data);
      this.videoList = this.data;
      this.frames = this.audios = [];
    }
    else{
      this.frames = this.data["scene_image"];
      this.audios = this.data["wavfile"];
      this.videoList = [];
    }
  }

  onPosterClick(image: any): void {
    // Extract video source from frame "image"
    let str2 = image;
    let tmpArray = str2.split("/");
    let folder = str2.substring(0, str2.lastIndexOf("/"));
    let video_name = tmpArray[tmpArray.length - 1]; //archivesearch_5e9592bca0fe6201df2985c9_340_415.mp4
    video_name = video_name.substring(0, video_name.lastIndexOf('_')); //archivesearch_5e9592bca0fe6201df2985c9_340  or archivesearch_5e9592bca0fe6201df2985c9-340
    let starttimestr = "0";
    if (video_name.indexOf("-") > 0) {
      // archivesearch_5e9592bca0fe6201df2985c9-340
      this.source_video = video_name.substring(0, video_name.lastIndexOf("-")) + ".mp4";
      starttimestr = video_name.split("-")[1];
    } else {
      // archivesearch_5e9592bca0fe6201df2985c9_340
      this.source_video = video_name.substring(0, video_name.lastIndexOf("_")) + ".mp4"; // archivesearch_5e9592bca0fe6201df2985c9.mp4
      starttimestr = video_name.substring(video_name.lastIndexOf("_") + 1);
    }

    let starttime = 0;
    if (starttimestr.indexOf(".") > 0) {
      starttime = parseFloat(starttimestr);
    } else {
      starttime = parseFloat(starttimestr) / 25.0;
      starttime = parseFloat(starttime.toFixed(2));
      this.startTime = starttime;
    }

    this.startTime = this.extractIntegerPart(this.startTime);

    this.source_video = 'http://' + window.location.hostname + ':8008/download?qfile=' + this.source_video;
    // alert(this.source_video + " " + this.startTime);
    if (this.source_video.trim().length !== 0) {
      // this.source_video = this.videoDownloadService.downloadVideo(this.source_video, this.startTime);
      this.videoDownloadService.downloadVideo(this.source_video, this.startTime).subscribe((url) => {
        this.source_video = url;
        // this.showVideoOverlay = true;
        // You can also set the video source here if needed
        // const videoPlayer = document.getElementById('videoPlayer') as HTMLVideoElement;
        // videoPlayer.src = url;
      });
      // alert(this.source_video);
      this.openVideoWindow();
    }
    else {
      alert("No video fetched!!");
    }
  }

  extractIntegerPart(input: number | string): number | string {
    if (typeof input === 'string') {
      // If input is a string, parse it as a float, extract the integer part, and return as a string
      const floatValue = parseFloat(input);
      if (!isNaN(floatValue)) {
        return Math.floor(floatValue).toString();
      } else {
        return 'Invalid Input';
      }
    } else if (typeof input === 'number') {
      // If input is already a number, extract the integer part
      return Math.floor(input);
    } else {
      // Handle other types or invalid inputs
      return 'Invalid Input';
    }
  }
  

  openVideoWindow() {
    const dynamicHtml = `
    <html>
      <body>
        <div>
          <video id="videoPlayer" controls>
            <source src="${this.source_video}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        </div>
        <script>
          const video = document.getElementById('videoPlayer');
          video.currentTime = ${this.startTime};
        </script>
      </body>
    </html>
  `;
    const newWindow = window.open('', '_blank', 'width=500,height=500');
    if (newWindow) {
      newWindow.document.open();
      newWindow.document.write(dynamicHtml);
    } else {
      // Handle the case where the new window couldn't be opened
      alert("Video error!");
      console.error('Failed to open new window');
    }
  }

  closeVideoOverlay(): void {
    this.showVideoOverlay = false;
    // // Optionally, you can also pause the video when closing the overlay
    // const videoElement: HTMLVideoElement = document.getElementById('videoPlayer') as HTMLVideoElement;
    // videoElement.pause();
    this.source_video = '';
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

  search(): void {

  }
}
