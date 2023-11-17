import { Component, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ImageBasedSearchService } from '../image-based-search.service';
import { DataSharingServiceService } from '../data-sharing-service.service';
import { MatDialog } from '@angular/material/dialog';
import { SoundEventDialogComponent } from '../sound-event-dialog/sound-event-dialog.component';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnDestroy {
  selectedFiles: File[] = [];
  selectedImages: File[] = [];
  selectedVideos: File[] = [];
  selectedAudios: File[] = [];
  objectURLs: string[] = []; // Array to store the object URLs
  selectedStatuses: boolean[] = [];
  selectedSoundEvent: boolean[] = [];
  showProgressBar: boolean = false;
  applyBlurEffect: boolean = false;
  applyBlurEffect_go_btn: boolean = false;

  textboxOpen = false;
  textBoxValue = ''; // To store the textbox value

  textBoxControl = new FormControl();
  availableWords: string[] = ['Speech', 'Male speech', 'man speaking', 'Female speech', 'woman speaking', 'Child speech', 'kid speaking', 'Conversation',
    'Narration,monologue', 'Babbling', 'Speech synthesizer', 'Shout', 'Bellow', 'Whoop', 'Yell', 'Battle cry', 'Children shouting', 'Screaming',
    'Whispering', 'Laughter', 'Baby laughter', 'Giggle', 'Snicker', 'Belly laugh', 'Chuckle,chortle', 'Crying,sobbing', 'Baby cry,infant cry',
    'Whimper', 'Wail,moan', 'Sigh', 'Singing', 'Choir', 'Yodeling', 'Chant', 'Mantra', 'Male singing', 'Female singing', 'Child singing',
    'Synthetic singing', 'Rapping', 'Humming', 'Groan', 'Grunt', 'Whistling', 'Breathing', 'Wheeze', 'Snoring', 'Gasp', 'Pant', 'Snort',
    'Cough', 'Throat clearing', 'Sneeze', 'Sniff', 'Run', 'Shuffle', 'Walk,footsteps', 'Chewing,mastication', 'Biting', 'Gargling',
    'Stomach rumble', 'Burping,eructation', 'Hiccup', 'Fart', 'Hands', 'Finger snapping', 'Clapping', 'Heart sounds,heartbeat',
    'Heart murmur', 'Cheering', 'Applause', 'Chatter', 'Crowd', 'Hubbub,speech noise,speech babble', 'Children playing', 'Animal',
    'Domestic animals,pets', 'Dog', 'Bark', 'Yip', 'Howl', 'Bow-wow', 'Growling', 'Whimper (dog)', 'Cat', 'Purr', 'Meow', 'Hiss',
    'Caterwaul', 'Livestock,farm animals,working animals', 'Horse', 'Clip-clop', 'Neigh,whinny', 'Cattle,bovinae', 'Moo', 'Cowbell',
    'Pig', 'Oink', 'Goat', 'Bleat', 'Sheep', 'Fowl', 'Chicken,rooster', 'Cluck', 'Crowing,cock-a-doodle-doo', 'Turkey', 'Gobble', 'Duck',
    'Quack', 'Goose', 'Honk', 'Wild animals', 'Roaring cats (lions,tigers)', 'Roar', 'Bird', 'Bird vocalization,bird call,bird song',
    'Chirp,tweet', 'Squawk', 'Pigeon,dove', 'Coo', 'Crow', 'Caw', 'Owl', 'Hoot', 'Bird flight,flapping wings', 'Canidae,dogs,wolves',
    'Rodents,rats,mice', 'Mouse', 'Patter', 'Insect', 'Cricket', 'Mosquito', 'Fly,housefly', 'Buzz', 'Bee,wasp,etc.', 'Frog', 'Croak',
    'Snake', 'Rattle', 'Whale vocalization', 'Music', 'Musical instrument', 'Plucked string instrument', 'Guitar', 'Electric guitar',
    'Bass guitar', 'Acoustic guitar', 'Steel guitar,slide guitar', 'Tapping (guitar technique)', 'Strum', 'Banjo', 'Sitar', 'Mandolin',
    'Zither', 'Ukulele', 'Keyboard (musical)', 'Piano', 'Electric piano', 'Organ', 'Electronic organ', 'Hammond organ', 'Synthesizer',
    'Sampler', 'Harpsichord', 'Percussion', 'Drum kit', 'Drum machine', 'Drum', 'Snare drum', 'Rimshot', 'Drum roll', 'Bass drum',
    'Timpani', 'Tabla', 'Cymbal', 'Hi-hat', 'Wood block', 'Tambourine', 'Rattle (instrument)', 'Maraca', 'Gong', 'Tubular bells', 'Mallet percussion',
    'Marimba,xylophone', 'Glockenspiel', 'Vibraphone', 'Steelpan', 'Orchestra', 'Brass instrument', 'French horn', 'Trumpet', 'Trombone',
    'Bowed string instrument', 'String section', 'Violin,fiddle', 'Pizzicato', 'Cello', 'Double bass', 'Wind instrument', 'woodwind instrument',
    'Flute', 'Saxophone', 'Clarinet', 'Harp', 'Bell', 'Church bell', 'Jingle bell', 'Bicycle bell', 'Tuning fork', 'Chime', 'Wind chime',
    'Change ringing (campanology)', 'Harmonica', 'Accordion', 'Bagpipes', 'Didgeridoo', 'Shofar', 'Theremin', 'Singing bowl',
    'Scratching (performance technique)', 'Pop music', 'Hip hop music', 'Beatboxing', 'Rock music', 'Heavy metal', 'Punk rock', 'Grunge',
    'Progressive rock', 'Rock and roll', 'Psychedelic rock', 'Rhythm and blues', 'Soul music', 'Reggae', 'Country', 'Swing music',
    'Bluegrass', 'Funk', 'Folk music', 'Middle Eastern music', 'Jazz', 'Disco', 'Classical music', 'Opera', 'Electronic music', 'House music',
    'Techno', 'Dubstep', 'Drum and bass', 'Electronica', 'Electronic dance music', 'Ambient music', 'Trance music', 'Music of Latin America',
    'Salsa music', 'Flamenco', 'Blues', 'Music for children', 'New-age music', 'Vocal music', 'A capella', 'Music of Africa', 'Afrobeat',
    'Christian music', 'Gospel music', 'Music of Asia', 'Carnatic music', 'Music of Bollywood', 'Ska', 'Traditional music', 'Independent music',
    'Song', 'Background music', 'Theme music', 'Jingle (music)', 'Soundtrack music', 'Lullaby', 'Video game music', 'Christmas music', 'Dance music',
    'Wedding music', 'Happy music', 'Funny music', 'Sad music', 'Tender music', 'Exciting music', 'Angry music', 'Scary music', 'Wind', 'Rustling leaves',
    'Wind noise (microphone)', 'Thunderstorm', 'Thunder', 'Water', 'Rain', 'Raindrop', 'Rain on surface', 'Stream', 'Waterfall', 'Ocean', 'Waves,surf',
    'Steam', 'Gurgling', 'Fire', 'Crackle', 'Vehicle', 'Boat,Water vehicle', 'Sailboat,sailing ship', 'Rowboat,canoe,kayak', 'Motorboat,speedboat',
    'Ship', 'Motor vehicle (road)', 'Car', 'Vehicle horn,car horn,honking', 'Toot', 'Car alarm', 'Power windows,electric windows', 'Skidding',
    'Tire squeal', 'Car passing by', 'Race car,auto racing', 'Truck', 'Air brake', 'Air horn,truck horn', 'Reversing beeps', 'Ice cream truck', 'ice cream van',
    'Bus', 'Emergency vehicle', 'Police car (siren)', 'Ambulance (siren)', 'Fire engine', 'fire truck (siren)', 'Motorcycle', 'Traffic noise', 'roadway noise',
    'Rail transport', 'Train', 'Train whistle', 'Train horn', 'Railroad car', 'train wagon', 'Train wheels squealing', 'Subway', 'metro underground', 'Aircraft',
    'Aircraft engine', 'Jet engine', 'Propeller', 'airscrew', 'Helicopter', 'Fixed-wing aircraft', 'airplane', 'Bicycle', 'Skateboard', 'Engine',
    'Light engine (high frequency)', 'Dental drill', 'dentist drill', 'Lawn mower', 'Chainsaw', 'Medium engine (mid frequency)', 'Heavy engine (low frequency)',
    'Engine knocking', 'Engine starting', 'Idling', 'Accelerating', 'revving', 'vroom', 'Door', 'Doorbell', 'Ding-dong', 'Sliding door', 'Slam', 'Knock', 'Tap', 'Squeak',
    'Cupboard open or close', 'Drawer open or close', 'Dishes', 'pots', 'pans', 'Cutlery', 'silverware', 'Chopping (food)', 'Frying (food)', 'Microwave oven',
    'Blender', 'Water tap', 'faucet', 'Sink (filling or washing)', 'Bathtub (filling or washing)', 'Hair dryer', 'Toilet flush', 'Toothbrush', 'Electric toothbrush',
    'Vacuum cleaner', 'Zipper (clothing)', 'Keys jangling', 'Coin (dropping)', 'Scissors', 'Electric shaver,electric razor', 'Shuffling cards', 'Typing',
    'Typewriter', 'Computer keyboard', 'Writing', 'Alarm', 'Telephone', 'Telephone bell ringing', 'Ringtone', 'Telephone dialing,DTMF', 'Dial tone', 'Busy signal',
    'Alarm clock', 'Siren', 'Civil defense siren', 'Buzzer', 'Smoke detector,smoke alarm', 'Fire alarm', 'Foghorn', 'Whistle', 'Steam whistle', 'Mechanisms',
    'Ratchet,pawl', 'Clock', 'Tick', 'Tick-tock', 'Gears', 'Pulleys', 'Sewing machine', 'Mechanical fan', 'Air conditioning', 'Cash register', 'Printer', 'Camera',
    'Single-lens reflex camera', 'Tools', 'Hammer', 'Jackhammer', 'Sawing', 'Filing (rasp)', 'Sanding', 'Power tool', 'Drill', 'Explosion', 'Gunshot,gunfire',
    'Machine gun', 'Fusillade', 'Artillery fire', 'Cap gun', 'Fireworks', 'Firecracker', 'Burst,pop', 'Eruption', 'Boom', 'Wood', 'Chop', 'Splinter', 'Crack',
    'Glass', 'Chink,clink', 'Shatter', 'Liquid', 'Splash,splatter', 'Slosh', 'Squish', 'Drip', 'Pour', 'Trickle,dribble', 'Gush', 'Fill (with liquid)', 'Spray',
    'Pump (liquid)', 'Stir', 'Boiling', 'Sonar', 'Arrow', 'Whoosh,swoosh,swish', 'Thump,thud', 'Thunk', 'Electronic tuner', 'Effects unit', 'Chorus effect',
    'Basketball bounce', 'Bang', 'Slap,smack', 'Whack,thwack', 'Smash,crash', 'Breaking', 'Bouncing', 'Whip', 'Flap', 'Scratch', 'Scrape', 'Rub', 'Roll', 'Crushing',
    'Crumpling,crinkling', 'Tearing', 'Beep,bleep', 'Ping', 'Ding', 'Clang', 'Squeal', 'Creak', 'Rustle', 'Whir', 'Clatter', 'Sizzle', 'Clicking', 'Clickety-clack',
    'Rumble', 'Plop', 'Jingle,tinkle', 'Hum', 'Zing', 'Boing', 'Crunch', 'Silence', 'Sine wave', 'Harmonic', 'Chirp tone', 'Sound effect', 'Pulse', 'Inside,small room',
    'Inside,large room or hall', 'Inside,public space', 'Outside,urban or manmade', 'Outside,rural or natural', 'Reverberation', 'Echo', 'Noise', 'Environmental noise',
    'Static', 'Mains hum', 'Distortion', 'Sidetone', 'Cacophony', 'White noise', 'Pink noise', 'Throbbing', 'Vibration', 'Television', 'Radio', 'Field recording'];
  filteredOptions: Observable<string[]>;


  dropdownOpen = false;
  dropdownOptions = [
    "person",
    "bicycle",
    "car",
    "motorbike",
    "aeroplane",
    "bus",
    "train",
    "truck",
    "boat",
    "traffic light",
    "fire hydrant",
    "stop sign",
    "parking meter",
    "bench",
    "bird",
    "cat",
    "dog",
    "horse",
    "sheep",
    "cow",
    "elephant",
    "bear",
    "zebra",
    "giraffe",
    "backpack",
    "umbrella",
    "handbag",
    "tie",
    "suitcase",
    "frisbee",
    "skis",
    "snowboard",
    "sports ball",
    "kite",
    "baseball bat",
    "baseball glove",
    "skateboard",
    "surfboard",
    "tennis racket",
    "bottle",
    "wine glass",
    "cup",
    "fork",
    "knife",
    "spoon",
    "bowl",
    "banana",
    "apple",
    "sandwich",
    "orange",
    "broccoli",
    "carrot",
    "hot dog",
    "pizza",
    "donut",
    "cake",
    "chair",
    "sofa",
    "pottedplant",
    "bed",
    "diningtable",
    "toilet",
    "tvmonitor",
    "laptop",
    "mouse",
    "remote",
    "keyboard",
    "cell phone",
    "microwave",
    "oven",
    "toaster",
    "sink",
    "refrigerator",
    "book",
    "clock",
    "vase",
    "scissors",
    "teddy bear",
    "hair drier",
    "toothbrush"
  ].sort();
  selectedArchive: string = "Rewind";
  archiveList: string[] = ["Rewind", "Old"];
  keywords: string[] = [];// holds keywords
  events: string[] = [];//holds sound event text labels
  objects_categories: string[] = [];


  ngOnInit() {
    // this.showProgressBarWithBlur();
    // this.selectedFiles = this.keywords = this.objects_categories = [];
  }

  constructor(private router: Router, private imageBasedSearch: ImageBasedSearchService, private dataSharingService: DataSharingServiceService, private dialog: MatDialog) {
    this.filteredOptions = this.textBoxControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.availableWords.filter((option) => option.toLowerCase().includes(filterValue));
  }


  // Function to show the progress bar and apply blur effect
  showProgressBarWithBlur() {
    console.log("Progress bar show called!!");
    this.showProgressBar = true;
    this.applyBlurEffect = true;
  }

  openTextbox() {
    this.textboxOpen = !this.textboxOpen;
    this.applyBlurEffect_go_btn = this.textboxOpen;
    this.dropdownOpen = false;
  }

  closeTextbox() {
    this.applyBlurEffect_go_btn = false;
    this.textboxOpen = false;
  }

  openDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    this.applyBlurEffect_go_btn = this.dropdownOpen;
    this.textboxOpen = false;
  }

  closeDropdown() {
    this.applyBlurEffect_go_btn = false;
    this.dropdownOpen = false;
  }

  selectOption(option: string) {
    // Handle option selection here
    console.log('Selected option:', option);
    if (this.dropdownOptions.indexOf(option) !== -1) {
      if (this.objects_categories.indexOf(option) === -1) {
        this.objects_categories.push(option);
      } else {
        alert(option + " is already selected!");
      }
    } else {
      alert(option + " is an invalid option!");
    }
    console.log(this.objects_categories);
    this.dropdownOpen = false; // Close the dropdown after selection
    this.applyBlurEffect_go_btn = false;
  }

  addKeyword(keyword: string) {
    // console.log(this.textBoxValue);
    keyword = keyword.trim().toLowerCase();
    if (this.keywords.map(kw => kw.toLowerCase()).indexOf(keyword) === -1) {
      // Keyword doesn't exist, add it to the list
      this.keywords.push(keyword);
    } else {
      alert(keyword + " is already added!");
    }
    this.closeTextbox();
    this.applyBlurEffect_go_btn = false;
  }

  addKeywordsV2(keywordsInput: string) {
    // console.log(this.textBoxValue);

    if (this.availableWords.includes(keywordsInput) && this.events.indexOf(keywordsInput) === -1) {
      //If keyword text is pciked from autocomplete
      // this.openSoundEventDialog("Sound event detected");
      this.events.push(keywordsInput);
      console.log(this.events);
    }
    else {
      // Split the input string into an array of keywords
      const inputKeywords = keywordsInput.split(';').map(keyword => keyword.trim().toLowerCase());

      // Filter out empty strings
      const validKeywords = inputKeywords.filter(keyword => keyword.length > 0);

      if (validKeywords.length === 1) {
        // If only one keyword is provided without a semicolon, add it directly
        const singleKeyword = validKeywords[0];
        if (this.keywords.map(kw => kw.toLowerCase()).indexOf(singleKeyword) === -1) {
          // Keyword doesn't exist, add it to the list
          this.keywords.push(singleKeyword);
        } else {
          alert(singleKeyword + " is already added!");
        }
      } else if (validKeywords.length > 1) {
        // Loop through the valid keywords and add them to the list
        validKeywords.forEach(keyword => {
          if (this.keywords.map(kw => kw.toLowerCase()).indexOf(keyword) === -1) {
            // Keyword doesn't exist, add it to the list
            this.keywords.push(keyword);
          } else {
            alert(keyword + " is already added!");
          }
        });
      }
    }

    this.closeTextbox();
    this.applyBlurEffect_go_btn = false;
  }

  // Function to hide the progress bar and remove blur effect
  hideProgressBar() {
    this.showProgressBar = false;
    this.applyBlurEffect = false;
  }

  @ViewChild('fileInput') fileInput!: ElementRef;

  // onImagesSelected(event: any) {
  //   const files: FileList = event.target.files;
  //   for (let i = 0; i < files.length; i++) {
  //     const file = files[i];
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       this.selectedImageSrcList.push(e.target.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedFiles = Array.from(inputElement.files);

      for (let i = 0; i < inputElement.files.length; i++) {
        this.selectedStatuses.push(false);
        this.selectedSoundEvent.push(false);
      };

      // Filter files based on their extensions
      this.selectedImages = this.selectedFiles.filter(file => this.isImageFile(file.name));
      this.selectedVideos = this.selectedFiles.filter(file => this.isVideoFile(file.name));
      this.selectedAudios = this.selectedFiles.filter(file => this.isAudioFile(file.name));

      if (this.selectedImages.length > 0 && this.selectedVideos.length > 0) {
        // alert("Eiher image(s) or video(s) can be choosen!!")
        this.openSoundEventDialog("Eiher image(s) or video(s) can be choosen!");
        this.clearImages();
      }

      else if (this.selectedImages.length == 0 && this.selectedAudios.length == 0 && this.selectedVideos.length == 0) {
        // alert("Invalid file type!!");
        this.openSoundEventDialog("Invalid file type!");
      }

      // if(this.selectedAudios.length > 0){
      //   // this.openSoundEventDialog();
      // }

      this.objectURLs = this.selectedFiles.map(file => URL.createObjectURL(file));
    }
  }

  updateSoundEventStatus(index: number, event: any): void {
    this.selectedSoundEvent[index] = event.target.checked;
  }

  updateSelectedStatus(index: number, event: any): void {
    // Toggle the checkbox status in selectedStatuses array
    this.selectedStatuses[index] = event.target.checked;

    // // Get the current file and its name
    // const file = this.selectedImages[index];
    // const fileName = file.name;
    // console.log(fileName);

    // // Split the file name into parts
    // const parts = fileName.split(".");

    // if (parts.length === 2) {
    //   const nameWithoutExtension = parts[0];
    //   const extension = parts[1];

    //   console.log(parts);

    //   // Check if the file name already contains "_object" or "_face"
    //   const isObject = nameWithoutExtension.endsWith("_obj");
    //   const isFace = nameWithoutExtension.endsWith("_fac");

    //   // Determine the modifier based on the checkbox status
    //   const modifier = this.selectedStatuses[index] ? "_obj" : "_fac";

    //   // Create the modified name if it doesn't already contain the modifier
    //   let modifiedName = nameWithoutExtension;
    //   if (isObject || isFace) {
    //     modifiedName = nameWithoutExtension.slice(0, -4); // Remove the existing modifier
    //   }
    //   modifiedName += modifier + "." + extension;

    //   console.log(modifiedName);

    //   // Create a new File object with the modified name
    //   const modifiedFile = new File([file], modifiedName);

    //   // Update the selectedImages array with the modified file
    //   this.selectedImages[index] = modifiedFile;
    //   this.selectedStatuses[index] = true;
    // } else {
    //   console.error("Invalid image name format");
    // }
  }


  // isImageFile(fileName: string): boolean {
  //   return fileName.toLowerCase().endsWith('.jpg')
  //     || fileName.toLowerCase().endsWith('.jpeg')
  //     || fileName.toLowerCase().endsWith('.png')
  //     || fileName.toLowerCase().endsWith('.gif')
  //     || fileName.toLowerCase().endsWith('.bmp');
  // }

  isImageFile(fileName: string): boolean {
    const trimmedFileName = fileName.trim();
    const withoutSpaces = trimmedFileName.replace(/\s/g, ''); // Replace spaces with an empty string
    const lowerCaseFileName = withoutSpaces.toLowerCase();

    return lowerCaseFileName.endsWith('.jpg') ||
      lowerCaseFileName.endsWith('.jpeg') ||
      lowerCaseFileName.endsWith('.png') ||
      lowerCaseFileName.endsWith('.gif') ||
      lowerCaseFileName.endsWith('.bmp');
  }

  isVideoFile(fileName: string): boolean {
    const trimmedFileName = fileName.trim();
    const withoutSpaces = trimmedFileName.replace(/\s/g, ''); // Replace spaces with an empty string
    const lowerCaseFileName = withoutSpaces.toLowerCase();

    return lowerCaseFileName.endsWith('.mp4') ||
      lowerCaseFileName.endsWith('.avi') ||
      lowerCaseFileName.endsWith('.mov') ||
      lowerCaseFileName.endsWith('.wmv') ||
      lowerCaseFileName.endsWith('.mkv');
  }

  isAudioFile(fileName: string): boolean {
    const trimmedFileName = fileName.trim();
    const withoutSpaces = trimmedFileName.replace(/\s/g, ''); // Replace spaces with an empty string
    const lowerCaseFileName = withoutSpaces.toLowerCase();

    return lowerCaseFileName.endsWith('.wav') ||
      lowerCaseFileName.endsWith('.mp3');
  }



  // isVideoFile(fileName: string): boolean {
  //   return fileName.toLowerCase().endsWith('.mp4')
  //     || fileName.toLowerCase().endsWith('.avi')
  //     || fileName.toLowerCase().endsWith('.mov')
  //     || fileName.toLowerCase().endsWith('.wmv')
  //     || fileName.toLowerCase().endsWith('.mkv');
  // }

  // isAudioFile(fileName: string): boolean {
  //   return fileName.toLowerCase().endsWith('.wav')
  //     || fileName.toLowerCase().endsWith('.wav');
  // }

  ngOnDestroy(): void {
    // Revoke all object URLs in the objectURLs array
    this.objectURLs.forEach(url => URL.revokeObjectURL(url));
  }

  openSoundEventDialog(msg: string): void {
    const data = {
      msg: msg
    };

    const dialogRef = this.dialog.open(SoundEventDialogComponent, {
      data: data,
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(() => {
      // Handle dialog close event if needed
    });
  }

  clearImages() {
    this.selectedImages = this.selectedVideos = this.selectedAudios = [];
    // Reset the file input to clear the selected files
    this.fileInput.nativeElement.value = '';
    this.closeTextbox();
    this.closeDropdown();
    this.keywords = [];
    this.objects_categories = [];
    this.events = [];
    // window.location.reload();
  }

  home() {
    alert("Feature is not implemented!");
  }

  // goToSecondComponent(): void {
  //   this.showProgressBarWithBlur();
  //   if (this.selectedFiles.length == 0) {
  //     alert("Please upload file(s)!")
  //     this.hideProgressBar();
  //   }
  //   else {
  //     this.imageBasedSearch.performAction(this.selectedImages).then(response => {
  //       console.log(response);
  //       const data = response.location;
  //       this.dataSharingService.sharedData = data;
  //       this.hideProgressBar();
  //       this.router.navigateByUrl('/searchResults');
  //     }).catch(error => { console.error(error) });
  //     this.hideProgressBar();
  //   }
  // }
  goToSecondComponent(): void {
    // this.router.navigateByUrl('/searchResults');

    this.showProgressBarWithBlur();

    if (this.selectedFiles.length == 0 && this.keywords.length == 0 && this.objects_categories.length == 0) {
      // alert("No search criteria specified!");
      this.openSoundEventDialog("No search criteria specified!");
      this.hideProgressBar();
      return;
    }
    if (this.selectedVideos.length >= 1 && ((this.selectedImages.length >= 1) || (this.selectedAudios.length >= 1))) {
      // alert("Searching and video analysis is not supported, simultaneously!");
      this.openSoundEventDialog("Searching and video analysis is not supported, simultaneously!");
      this.hideProgressBar();
      return;
    }

    if (this.selectedVideos.length >= 1) {
      console.log("Video analysis service.");
      // Use setTimeout to create a delay and allow the progress bar to be displayed
      setTimeout(() => {
        this.imageBasedSearch.analyse_video(this.selectedVideos)
          .then(response => {
            console.log(response);
            const data = response;
            this.dataSharingService.sharedData = data;
            this.dataSharingService.isAnalysis = true;
            this.hideProgressBar();
            this.router.navigateByUrl('/searchResults');
          })
          .catch(error => {
            console.error(error);
            this.hideProgressBar(); // Ensure the progress bar is hidden in case of an error
            this.openSoundEventDialog("Error from the API server!");
          });
      }, 100); // Adjust the delay time (milliseconds) as needed, e.g., 100ms
    }
    else {
      console.log("Search service.");
      // this.router.navigateByUrl('/searchResults');
      // Use setTimeout to create a delay and allow the progress bar to be displayed
      setTimeout(() => {
        this.imageBasedSearch.searchV2(this.selectedImages, this.selectedAudios, this.keywords, this.objects_categories, this.selectedStatuses, [], this.selectedSoundEvent)
          .then(response => {
            console.log(response);
            const data = response;
            this.dataSharingService.sharedData = data;
            this.hideProgressBar();
            this.router.navigateByUrl('/searchResults');
          })
          .catch(error => {
            console.error(error);
            this.hideProgressBar(); // Ensure the progress bar is hidden in case of an error
            this.openSoundEventDialog("Error from the API server!");
          });
      }, 100); // Adjust the delay time (milliseconds) as needed, e.g., 100ms
    }

    // if (this.selectedImages.length >= 1) {
    //   console.log("Image service.");
    //   // Use setTimeout to create a delay and allow the progress bar to be displayed
    //   setTimeout(() => {
    //     this.imageBasedSearch.performAction(this.selectedImages)
    //       .then(response => {
    //         console.log(response);
    //         const data = response.location;
    //         this.dataSharingService.sharedData = data;
    //         this.hideProgressBar();
    //         this.router.navigateByUrl('/searchResults');
    //       })
    //       .catch(error => {
    //         console.error(error);
    //         this.hideProgressBar(); // Ensure the progress bar is hidden in case of an error
    //       });
    //   }, 100); // Adjust the delay time (milliseconds) as needed, e.g., 100ms
    // }
    // else if (this.selectedAudios.length >= 1) {
    //   console.log("Audio service");
    //   setTimeout(() => {
    //     this.imageBasedSearch.performAction(this.selectedAudios)
    //       .then(response => {
    //         console.log(response);
    //         const data = response.location;
    //         this.dataSharingService.sharedData = data;
    //         this.hideProgressBar();
    //         this.router.navigateByUrl('/searchResults');
    //       })
    //       .catch(error => {
    //         console.error(error);
    //         this.hideProgressBar(); // Ensure the progress bar is hidden in case of an error
    //       });
    //   }, 100); // Adjust the delay time (milliseconds) as needed, e.g., 100ms
    // }
    // else if (this.selectedVideos.length >= 1) {
    //   console.log("Video service.");
    //   // Use setTimeout to create a delay and allow the progress bar to be displayed
    //   setTimeout(() => {
    //     this.imageBasedSearch.analyse_video(this.selectedVideos)
    //       .then(response => {
    //         console.log(response);
    //         const data = response;
    //         this.dataSharingService.sharedData = data;
    //         this.hideProgressBar();
    //         this.router.navigateByUrl('/searchResults');
    //       })
    //       .catch(error => {
    //         console.error(error);
    //         this.hideProgressBar(); // Ensure the progress bar is hidden in case of an error
    //       });
    //   }, 100); // Adjust the delay time (milliseconds) as needed, e.g., 100ms
    // }

  }

}
