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
  modality: string[] = [];
  videoIdForDisplay: any = "";
  highlighted: boolean[] = [];

  ngOnInit(): void {
    this.videoData = this.data["otherInfo"];
    this.videoSrc = this.data.videoSrc;
    this.startTime = this.data["startTime"];
    this.synopis = this.data["synopsis"];
    this.currentVideoId = this.data["currentId"];
    if (this.videoData && (this.currentVideoId in this.videoData) && ("startTime" in this.videoData[this.currentVideoId])) {
      this.startTimes = this.videoData[this.currentVideoId]["startTime"];
      this.modality = this.videoData[this.currentVideoId]["modality"];
      console.log(this.modality);
      for(let i = 0; i < this.modality.length; i++){
        if(this.modality[i] === "multimodal"){
          this.highlighted.push(true);
          console.log("modality is "+this.modality[i]);
        }
        else{
          this.highlighted.push(false);
        }
      }
      console.log(this.highlighted);
      this.startTimes = this.secondsListToHMSList(this.startTimes.slice(1));
      this.videoIdForDisplay = this.currentVideoId.split("/");
      this.videoIdForDisplay = this.videoIdForDisplay[this.videoIdForDisplay.length - 1];
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

  // setInitialTime() {
  //   const videoElement = this.videoPlayer.nativeElement as HTMLVideoElement;

  //   if (videoElement) {
  //     // Set the initial time (e.g., 30 seconds)
  //     videoElement.currentTime = parseFloat(this.startTime);
  //     videoElement.play();
  //   }
  // }

  setInitialTime() {
    const videoElement = this.videoPlayer.nativeElement as HTMLVideoElement;
  
    if (videoElement) {
      // Parse the start time
      const startTime = this.startTime;
  
      // Check if the parsed time is a finite number
      if (isNaN(startTime) || !isFinite(startTime)) {
        console.error("Invalid start time. Setting default start time to 0.");
        console.log(startTime);
        // Set the initial time to 0
        videoElement.currentTime = 0;
      } else {
        // Set the initial time to the parsed value
        videoElement.currentTime = startTime;
      }
  
      // Start playing the video
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
  
  // HMSToSeconds(hms: string): number {
  //   const [hours, minutes, seconds] = hms.split(':').map(Number);
  //   return hours * 3600 + minutes * 60 + seconds;
  // }

  HMSToSeconds(hms: string): number {
    const [hours, minutes, seconds] = hms.split(':').map(Number);
  
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
      console.error('Invalid HMS format:', hms);
      return 0; // Return 0 or another default value indicating an error
    }
  
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  
    if (!isFinite(totalSeconds)) {
      console.error('Invalid total seconds:', totalSeconds);
      return 0; // Return 0 or another default value indicating an error
    }
  
    return totalSeconds;
  }
  

}
