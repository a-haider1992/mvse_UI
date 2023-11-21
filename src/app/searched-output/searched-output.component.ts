import { Component } from '@angular/core';
import { DataSharingServiceService } from '../data-sharing-service.service';
import { VideoDownloadService } from '../video-download.service';
import { ImageBasedSearchService } from '../image-based-search.service';
import { MatDialog } from '@angular/material/dialog';
import { VideoDialogComponent } from '../video-dialog/video-dialog.component';
import { takeWhile } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-searched-output',
  templateUrl: './searched-output.component.html',
  styleUrls: ['./searched-output.component.scss']
})
export class SearchedOutputComponent {

  constructor(private router: Router, private dataSharingService: DataSharingServiceService,
    private videoDownloadService: VideoDownloadService, private imageBasedSearch: ImageBasedSearchService, private dialog: MatDialog) { }
  selectedImages: any[] = [];
  selectedAudios: any[] = [];
  selectedScenes: any[] = [];

  // frames: any[] = ["../assets/images/image.png", "../assets/images/logo.png", "../assets/images/image.png", "../assets/images/logo.png", "../assets/images/logo.png"];
  // audios: any[] = ["../assets/audios/0.wav", "../assets/audios/0.wav", "../assets/audios/0.wav", "../assets/audios/0.wav", "../assets/audios/0.wav", "../assets/audios/0.wav"];
  // videoList: string[] = [
  //   '../assets/videos/test2.mp4', '../assets/videos/test3.mp4', '../assets/videos/test2.mp4', '../assets/videos/test2.mp4', '../assets/videos/test2.mp4', '../assets/videos/test2.mp4', '../assets/videos/test2.mp4', '../assets/videos/test2.mp4', '../assets/videos/test2.mp4', '../assets/videos/test6.mp4', '../assets/videos/test6.mp4', '../assets/videos/test6.mp4', '../assets/videos/test6.mp4'
  // ];
  frames_stamp: any[] = ["10", "10", "10", "10", "10"];
  audios_stamp: any[] = ["10", "10", "10", "10", "10", "10"];
  // topics: { topic: string; selected: boolean }[] = [
  //   { topic: 'Topic 1', selected: false },
  //   { topic: 'Topic 2', selected: false },
  //   { topic: 'Topic 3', selected: false },
  // ];
  topics: { topic: string; selected: boolean }[] = [];
  videoList: any[] = [];
  frames: any[] = [];
  audios: any[] = [];
  Scenes: any[] = [];

  selectedTopics: string[] = [];
  // To store posters returned by API call
  posterList: string[] = [];

  data: any = {};
  source_video: string = '';
  currentVideoId: string = '';
  startTime: any = 0;
  synopsis: string = 'No synopis found';
  showVideoOverlay = false;
  showProgressBar: boolean = false;
  applyBlurEffect: boolean = false;
  isAnalysis: boolean = false;
  videoDictionary: Record<string, { modality: string[], seg_id: string[], startTime: string[], endTime_with_extension: string[], synopsis: string }> = {};

  ngOnInit(): void {
    this.data = this.dataSharingService.sharedData;
    console.log(this.data);
    this.isAnalysis = this.dataSharingService.isAnalysis;

    if (this.data.hasOwnProperty("synopsis")) {
      this.videoDictionary = this.prepareDictionary(this.data["location"], this.data["synopsis"]);
      console.log("Prepared Dictionary!!");
      console.log(this.videoDictionary);
      // console.log(this.getVideoList(this.videoDictionary));
      // console.log("Inside ngOnInit of search page!");
      this.videoList = this.getVideoList(this.videoDictionary);
      console.log(this.videoList);
      this.frames = this.audios = [];
    }
    // if (Array.isArray(this.data)) {
    //   // console.log(this.prepareDictionary(this.data));
    //   this.videoDictionary = this.prepareDictionary(this.data);
    //   // console.log(this.getVideoList(this.videoDictionary));
    //   // console.log("Inside ngOnInit of search page!");
    //   this.videoList = this.getVideoList(this.videoDictionary);
    //   console.log(this.videoList);
    //   this.frames = this.audios = [];
    // }
    else {
      this.frames = this.data["location"];
      this.audios = this.data["wavfile"];
      console.log(this.audios);
      this.frames_stamp = this.extractFrameStamp(this.frames);
      this.audios_stamp = this.extractFrameStamp(this.audios);
      this.topics = this.extractTopics(this.data["words_box"]);
      this.Scenes = this.data["scene_image"];
      console.log(this.frames_stamp);
      console.log(this.audios_stamp);
      this.videoList = [];
      this.videoDictionary = {};
    }
  }

  openVideoDialog(): void {
    const data = {
      videoSrc: this.source_video,
      startTime: this.startTime,
      synopsis: this.synopsis,
      otherInfo: this.videoDictionary,
      currentId: this.currentVideoId
    };

    const dialogRef = this.dialog.open(VideoDialogComponent, {
      data: data,
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(() => {
      // Handle dialog close event if needed
    });
  }

  getVideoList(dict: Record<string, { modality: string[], seg_id: string[], startTime: string[], endTime_with_extension: string[], synopsis: string }>): string[] {
    const videoList: string[] = [];

    for (const key in dict) {
      if (Object.prototype.hasOwnProperty.call(dict, key)) {
        const item = dict[key];
        // Assuming that the videos have a specific naming pattern based on the provided properties.
        const videoName = `${key}_${item.modality[0]}_${item.seg_id[0]}_${item.startTime[0]}_${item.endTime_with_extension[0]}`;
        videoList.push(videoName);
      }
    }
    return videoList;
  }

  // prepareDictionary(segments: string[], synopis: any): Record<string, { modality: string[], seg_id: string[], startTime: string[], endTime_with_extension: string[], synopis: string }> {
  //   const dictionary: Record<string, { modality: string[], seg_id: string[], startTime: string[], endTime_with_extension: string[], synopsis: string }> = {};

  //   if (segments.length >= 1) {
  //     for (const segment of segments) {
  //       const parts = segment.split('_');
  //       if (parts.length >= 4) {
  //         console.log("Preparing dictionary!");
  //         const key = parts[0] + "_" + parts[1];
  //         const modality = parts[2];
  //         const seg_id = parts[3];
  //         const startTime = parts[4];
  //         const endTime_with_extension = parts[parts.length - 1];

  //         // If the key doesn't exist in the dictionary, initialize the arrays.
  //         if (!dictionary[key]) {
  //           dictionary[key] = {
  //             modality: [],
  //             seg_id: [],
  //             startTime: [],
  //             endTime_with_extension: [],
  //             synopsis: ""
  //           };
  //         }

  //         // Push the values into the respective arrays.
  //         dictionary[key].modality.push(modality);
  //         dictionary[key].seg_id.push(seg_id);
  //         dictionary[key].startTime.push(startTime);
  //         dictionary[key].endTime_with_extension.push(endTime_with_extension);
  //         const synopsis_key = parts[1].split("/");
  //         dictionary[key].synopsis = synopis[synopsis_key[3]];
  //       }
  //     }
  //   }
  //   // console.log("Dictionary prepared -- " + dictionary);
  //   return dictionary;
  // }


  prepareDictionary(
    segments: string[],
    synopsis: Record<string, string>
  ): Record<string, { modality: string[], seg_id: string[], startTime: string[], endTime_with_extension: string[], synopsis: string }> {
    const dictionary: Record<string, { modality: string[], seg_id: string[], startTime: string[], endTime_with_extension: string[], synopsis: string }> = {};

    if (segments.length >= 1) {
      for (const segment of segments) {
        const parts = segment.split('_');
        if (parts.length >= 4) {
          // console.log("Preparing dictionary!");
          const key = parts[0] + "_" + parts[1];
          const modality = parts[2];
          if (modality === 'multimodal') {
            console.log(modality);
          }
          const seg_id = parts[3];
          const startTime = parts[4];
          const endTime_with_extension = parts[parts.length - 1];

          // If the key doesn't exist in the dictionary, initialize the arrays.
          if (!dictionary[key]) {
            dictionary[key] = {
              modality: [],
              seg_id: [],
              startTime: [],
              endTime_with_extension: [],
              synopsis: ""
            };
          }

          // console.log(synopis);

          // Push the values into the respective arrays.
          dictionary[key].modality.push(modality);
          dictionary[key].seg_id.push(seg_id);
          dictionary[key].startTime.push(startTime);
          dictionary[key].endTime_with_extension.push(endTime_with_extension);
          // Parse the hexadecimal key to an integer
          const parts_sub = parts[1].split('/');
          const synopsis_key = parts_sub[parts_sub.length - 1];
          // console.log(synopsis);
          if (synopsis && synopsis_key in synopsis) {
            const synopsisValue = synopsis[synopsis_key];

            if (synopsisValue !== "") {
              dictionary[key].synopsis = synopsisValue;
            } else {
              dictionary[key].synopsis = "No synopsis found.";
            }
          } else {
            dictionary[key].synopsis = "No synopsis found.";
          }

        }
      }
    }
    // console.log("Dictionary prepared -- " + dictionary);
    return dictionary;
  }


  dynamicMaxHeight(): string {
    const fixedDistanceFromBottom = 200; // Adjust this value as needed
    const screenHeight = window.innerHeight;
    const maxHeight = screenHeight - fixedDistanceFromBottom;
    return `${maxHeight}px`;
  }


  extractTopics(words: string[]): { topic: string; selected: boolean }[] {
    const topicsExtracted: { topic: string; selected: boolean }[] = [];

    for (const word of words) {
      topicsExtracted.push({ topic: word, selected: false });
    }

    return topicsExtracted;
  }

  home() {
    alert("Feature is not implemented!");
  }

  extractFrameStamp(frames: string[]): number[] {
    const frameStamps: number[] = [];

    for (const frame of frames) {
      const parts = frame.split('_');
      if (parts.length >= 4) {
        const frameStamp = parseFloat(parts[4]);
        console.log(frameStamp);
        if (!isNaN(frameStamp)) {
          frameStamps.push(frameStamp);
        }
      }
    }
    return frameStamps;
  }

  onPosterClick(image: any): void {
    // Extract video source from frame "image"
    let starttimestr = "0";
    let str2 = image;
    let tmpArray = str2.split("/");
    let video_name = tmpArray[tmpArray.length - 1];
    let key_parts = str2.split("_");
    let key = key_parts[0] + "_" + key_parts[1];
    // console.log(video_name);
    if (video_name.includes("scene") || video_name.includes("face") || video_name.includes("audio") || video_name.includes("object") || video_name.includes("keyword") || video_name.includes("multimodal") || video_name.includes("event")) {
      const parts = video_name.split("_");
      if (parts.length >= 4) {
        this.source_video = parts[0] + ".mp4";
        this.currentVideoId = key;
        starttimestr = parts[parts.length - 2];
      }
      // console.log("Inside scene --" + this.source_video);
      // console.log(starttimestr);
    }
    else {
      // Handle other cases or provide a default value
      video_name = video_name.split("_");
      this.source_video = video_name[0] + ".mp4";
      // starttimestr = video_name[1];
      // console.log(this.source_video);
      // console.log(starttimestr);
    }

    // let str2 = image;
    // let tmpArray = str2.split("/");
    // let folder = str2.substring(0, str2.lastIndexOf("/"));
    // let video_name = tmpArray[tmpArray.length - 1]; //archivesearch_5e9592bca0fe6201df2985c9_340_415.mp4
    // video_name = video_name.substring(0, video_name.lastIndexOf('_')); //archivesearch_5e9592bca0fe6201df2985c9_340  or archivesearch_5e9592bca0fe6201df2985c9-340
    // let starttimestr = "0";
    // if (video_name.indexOf("-") > 0) {
    //   // archivesearch_5e9592bca0fe6201df2985c9-340
    //   this.source_video = video_name.substring(0, video_name.lastIndexOf("-")) + ".mp4";
    //   starttimestr = video_name.split("-")[1];
    // } else {
    //   // archivesearch_5e9592bca0fe6201df2985c9_340
    //   // this.source_video = video_name.substring(0, video_name.lastIndexOf("_")) + ".mp4"; // archivesearch_5e9592bca0fe6201df2985c9.mp4
    //   // starttimestr = video_name.substring(video_name.lastIndexOf("_") + 1);
    // }

    // let starttime = 0;
    // if (starttimestr.indexOf(".") > 0) {
    //   starttime = parseFloat(starttimestr);
    // } else {
    //   starttime = parseFloat(starttimestr) / 25.0;
    //   starttime = parseFloat(starttime.toFixed(2));
    //   this.startTime = starttime;
    // }

    // this.startTime = this.extractIntegerPart(this.startTime);

    // var starttime = parseFloat(starttimestr) / 25.0;
    // starttime = parseFloat(starttime.toFixed(2));
    this.startTime = parseFloat(starttimestr);
    console.log(this.startTime);

    this.source_video = 'http://' + window.location.hostname + ':8008/download?qfile=' + this.source_video;
    // console.log(key);
    this.synopsis = this.videoDictionary[key].synopsis;
    console.log("Inside poster click " + this.synopsis);
    // alert(this.source_video + " " + this.startTime);
    if (this.source_video.trim().length !== 0) {
      // this.source_video = this.videoDownloadService.downloadVideo(this.source_video, this.startTime);
      // this.videoDownloadService.downloadVideo(this.source_video, this.startTime).subscribe((url) => {
      //   this.source_video = url;
      //   // this.showVideoOverlay = true;
      //   // You can also set the video source here if needed
      //   // const videoPlayer = document.getElementById('videoPlayer') as HTMLVideoElement;
      //   // videoPlayer.src = url;
      // });
      // alert(this.source_video);
      // this.openVideoWindow();
      this.openVideoDialog();
    }
    else {
      alert("No video fetched!!");
    }
  }

  handleImageError(event: any): void {
    const imgElement = event.target;
    imgElement.src = "../assets/images/image-failed.png"; // Display a fallback image.
    // You can also show an error message or log the error.
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
      <title>MVSE video player</title>
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
    const windowFeatures = "left=100,top=100,width=500,height=500";
    const newWindow = window.open(
      "Selected video",
      "_blank",
      windowFeatures,
    );
    if (newWindow) {
      // newWindow.document.open();
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
    const parts = src.split("/");
    const file_name = parts[parts.length - 1];
    // console.log(file_name);
    if (this.selectedImages.includes(file_name)) {
      // Deselect audio
      this.selectedImages = this.selectedImages.filter(a => a !== file_name);
    } else {
      // Select audio
      this.selectedImages.push(file_name);
    }
    console.log(this.selectedImages);
  }

  isImageSelected(src: string): boolean {
    const parts = src.split("/");
    const file_name = parts[parts.length - 1];
    return this.selectedImages.includes(file_name);
  }

  toggleSceneSelection(src: string): void {
    const parts = src.split("/");
    const file_name = parts[parts.length - 1];
    // console.log(file_name);
    if (this.selectedScenes.includes(file_name)) {
      // Deselect audio
      this.selectedScenes = this.selectedScenes.filter(a => a !== file_name);
    } else {
      // Select audio
      this.selectedScenes.push(file_name);
    }
    console.log(this.selectedScenes);
  }

  isSceneSelected(src: string): boolean {
    const parts = src.split("/");
    const file_name = parts[parts.length - 1];
    return this.selectedScenes.includes(file_name);
  }

  isAudioSelected(audio: string): boolean {
    const parts = audio.split("/");
    const file_name = parts[parts.length - 1];
    return this.selectedAudios.includes(file_name);
  }

  toggleTopicSelection(topic: { topic: string; selected: boolean }): void {
    this.selectedTopics = this.topics
      .filter((t) => t.selected)
      .map((t) => t.topic);
    console.log(this.selectedTopics);
  }

  toggleAudioSelection(audio: string): void {
    const parts = audio.split("/");
    const file_name = parts[parts.length - 1];
    if (this.selectedAudios.includes(file_name)) {
      // Deselect audio
      this.selectedAudios = this.selectedAudios.filter(a => a !== file_name);
    } else {
      // Select audio
      this.selectedAudios.push(file_name);
    }
    console.log(this.selectedAudios);
    ;
  }

  redirectToFirstPage() {
    this.router.navigate(['/']); // Navigate to the first page
  }

  search(): void {
    this.showProgressBar = true;
    this.applyBlurEffect = true;
    console.log("Search after analysis");
    console.log("Frames selected :" + this.selectedImages);
    console.log("Audios selecetd :" + this.selectedAudios);
    setTimeout(() => {
      this.imageBasedSearch.searchV2(this.selectedImages, this.selectedAudios, this.selectedTopics, [], [], this.selectedScenes, [], [])
        .then(response => {
          console.log(response);
          console.log(response.location);
          console.log(response["synopsis"]);
          this.videoDictionary = this.prepareDictionary(response.location, response["synopsis"]);
          this.videoList = this.getVideoList(this.videoDictionary);
          this.showProgressBar = false;
          this.applyBlurEffect = false;
          // this.router.navigateByUrl('/searchResults');
        })
        .catch(error => {
          console.error(error);
          this.showProgressBar = false; // Ensure the progress bar is hidden in case of an error
          this.applyBlurEffect = false;
        });
    }, 100); // Adjust the delay time (milliseconds) as needed, e.g., 100ms
  }
}
