import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-video-dialog',
  templateUrl: './video-dialog.component.html',
  styleUrls: ['./video-dialog.component.scss',]
})
export class VideoDialogComponent implements OnInit, AfterViewInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<VideoDialogComponent>) { }

  @ViewChild('videoPlayer')
  videoPlayer!: ElementRef;

  ngAfterViewInit() {
    // Access the videoPlayer.nativeElement here if needed
    this.setInitialTime();
  }


  videoData: any = {}
  currentVideoId: any = "";
  videoSrc: any = "";
  synopis: any = "";
  startTime: any = 0;
  startTimes: string[] = [];

  ngOnInit(): void {
    this.videoData = this.data["otherInfo"];
    this.videoSrc = this.data.videoSrc;
    this.startTime = this.data.startTime;
    this.synopis = this.data["synopsis"];
    this.currentVideoId = this.data["currentId"];
    if (this.videoData && (this.currentVideoId in this.videoData) && ("startTime" in this.videoData[this.currentVideoId])) {
      this.startTimes = this.videoData[this.currentVideoId]["startTime"];
      this.startTimes = this.secondsListToHMSList(this.startTimes.slice(1));
    }
    // this.setInitialTime();
    // console.log(this.data["otherInfo"]);
    // console.log(this.startTimes);
    // console.log(this.startTime);
    // console.log(this.synopis);
    // const videoElement = this.videoPlayer.nativeElement as HTMLVideoElement;

    // if (videoElement) {
    //   const parsedTime = this.startTime;
    //   console.log(parsedTime); // Log the parsed time to check its value
    //   videoElement.currentTime = parsedTime;
    //   videoElement.play();
    // }
    // You can perform any additional initialization here if needed.
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
  seekToStartTime(time: string) {
    const videoElement = this.videoPlayer.nativeElement as HTMLVideoElement;

    if (videoElement) {
      // const parsedTime = parseFloat(time);
      const parsedTime = this.HMSToSeconds(time);
      console.log(parsedTime); // Log the parsed time to check its value
      videoElement.currentTime = parsedTime;
      videoElement.play();
    }
  }

  setInitialTime() {
    const videoElement = this.videoPlayer.nativeElement as HTMLVideoElement;

    if (videoElement) {
      // Set the initial time (e.g., 30 seconds)
      videoElement.currentTime = parseFloat(this.startTime);
      videoElement.play();
    }
  }

  secondsListToHMSList(secondsList: string[]): string[] {
    return secondsList.map((secondsString) => {
      const seconds = parseFloat(secondsString);
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = Math.floor(seconds % 60);
  
      const formattedHours = hours.toString().padStart(2, '0');
      const formattedMinutes = minutes.toString().padStart(2, '0');
      const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
  
      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    });
  }
  
  HMSToSeconds(hms: string): number {
    const [hours, minutes, seconds] = hms.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }

}
