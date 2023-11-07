import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-video-dialog',
  templateUrl: './video-dialog.component.html',
  styleUrls: ['./video-dialog.component.scss',]
})
export class VideoDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<VideoDialogComponent>) { }

  videoData: any = {}
  videoSrc: any = "";
  synopis: any = "";
  startTime: number = 0;
  ngOnInit(): void {
    console.log(this.data["startTime"]);
    this.videoData = this.data.otherInfo;
    this.videoSrc = this.data.videoSrc;
    this.startTime = this.data.startTime;
    this.synopis = this.data["synopsis"];
    // console.log(this.data.synopis);
    // You can perform any additional initialization here if needed.
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
  seekToStartTime() {
    const videoElement = document.getElementById('videoPlayer') as HTMLVideoElement;
  
    if (videoElement) {
      videoElement.currentTime = this.startTime;
      videoElement.play();
    }
  }
}
