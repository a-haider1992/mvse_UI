import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import nlp from 'compromise';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NlpService } from '../services/nlp.service';
import { response } from 'express';
import { Injectable } from '@angular/core';
// import * as cheerio from 'cheerio';
// import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { catchError, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ImageBasedSearchService } from '../image-based-search.service';
import { DataSharingServiceService } from '../data-sharing-service.service';




interface NLPResponse {
  subjects: string[];
  objects: string[];
  people: string[];
  places: string[];
  verbs:string[];
}

interface ImageResponse {
  image_urls: string[];
}
interface ISelectedStates {
  matchedsound: boolean[];
  matchedObjects: boolean[];
  imagesPeople: boolean[];
  imagesPlace: boolean[];
  sounds: boolean[];
  otherKeywords: boolean[];
  otherObjects: boolean[];
  identiPeople: { [key: string]: boolean[] };
}

@Component({
  selector: 'app-text2examples',
  templateUrl: './text2examples.component.html',
  styleUrls: ['./text2examples.component.scss']
})
//2024/7/7todolist:
//1. 明确new keywords和objects

export class Text2examplesComponent implements OnInit {

  searchQuery: string = ''; // 用来存储输入框的值
  sound: string[] = ['Speech', 'Speeches', 'speechify', 'speechified', 'speechifying', 'speechifier', 'speak', 'speaker', 'speaking', 'spoke', 'spoken', 'speakingly', 'speaks', 'Speeching',
    "talk", "talking", "talked","talks",
    "chat", "chatting", "chatted", "converse", "conversing", "conversation", "orate", "orating",
    "orated", "oration", "orator", "discourse", "discoursing", "discoursed", "address", "addressing",
    "addressed", "communicate", "communicating", "communicated", "communication", "vocalize",
    "vocalizing", "vocalized", "vocalization", "articulate", "articulating", "articulated",
    "articulation", "express", "expressing", "expressed", "expression", "declare", "declaring",
    "declared", "declaration", "state", "stating", "stated", "statement", "utter", "uttering",
    "uttered", "utterance", "pronounce", "pronouncing", "pronounced", "pronunciation", "announce",
    "announcing", "announced", "announcement",
    'Male speech', 'man speaking', 'Female speech', 'woman speaking', 'Child speech', 'kid speaking', 'Conversation',
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
  objects: string[] = [
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
  ];
  places: string[] = [
    "queen's_university_belfast",
    "shankill_road",
    "bank_buildings,_belfast",
    "europa_hotel",
    "giant's_causeway",
    "andersonstown",
    "harland_&_wolff_shipyard", //can't find
    "george_best_belfast_city_airport",
    "parliament_buildings,_stormont",
    "belfast_city_hall",
    "derry_walls",
    "aldergrove_airport",
    "floral_hall",
    "falls_road",
    "belfast_international_airport",
    "houses_of_parliament,_westminster",
    "mourne_mountains",
    "harbour_airport",
    "ulster_hall",
    "robinson_cleaver",
    "hillsborough_castle",
    "city_airport"
  ]; // Folder names
  politicians: string[] = ["paddy_devlin",
  "william_whitelaw",
  "cardinal_tomas",
  "reginald_maudling",
  "john_mckeague",
  "michael_farrell",
  "eamonn_mccann",
  ".DS_Store",
  "james_chichester",
  "james_molyneaux",
  "john_taylor",
  "bishop_edward_daly",
  "oliver_napier",
  "jack_lynch",
  "mairead_corrigan",
  "albert_anderson",
  "brian_faulkner",
  "betty_williams",
  "william_craig",
  "sir_basil_brooke",
  "captain_terence",
  "roy_bradford",
  "merlyn_rees",
  "enoch_powell",
  "ian_paisley",
  "lord_brooke_borough",
  "harry_west",
  "rev_robert_bradford",
  "roy_mason",
  "major_ronald_bunting",
  "bernadette_devlin",
  "james_callaghan",
  "tommy_herron",
  "maire_drumm",
  "general_ian_freeland",
  "austin_currie",
  "humphrey_atkins",
  "john_hume",
  "ivan_cooper",
  "gerry_fitt",
  "sean_lemass",
  "eddie_mcateer",
// "margaret_thatcher"
];

  imagesPeople: string[] = [];
  imagesPlace: string[] = [];
  sounds: string[] = [];
  matchedsound: string[] = []; // 用来存储匹配到的关键词
  matchedObjects: string[] = [];  // 用来存储匹配到的对象
  matchedPeople: string[] = [];
  matchedPlace: string[] = [];
  otherObjects: string[] = [];
  otherKeywords: string[] = [];
  private API_BASE_URL = 'http://localhost:8000';
  // private API_BASE_URL = window.location.port;

  private CONFIG = {
    API_PREFIX: '/api',
    // 其他配置...
  };
  selectedStates: {// 定义selectedStates，其中identiPeople是一个字典，其他都是布尔数组
    matchedsound: boolean[];
    matchedObjects: boolean[];
    imagesPeople: boolean[];
    imagesPlace: boolean[];
    sounds: boolean[];
    otherKeywords: boolean[];
    otherObjects: boolean[];
    identiPeople: { [key: string]: boolean[] };
  } = {
      matchedsound: [],
      matchedObjects: [],
      imagesPeople: [],
      imagesPlace: [],
      sounds: [],
      otherKeywords: [],
      otherObjects: [],
      identiPeople: {}
    };

  errorMessage: string | undefined; // 用来存储错误消息
  // identiPeople: string[] = [];
  identiPlace: string[] = [];
  // intelPeople: string[] = [];
  intelPlace: string[] = [];
  // 初始化 identiPeople 为一个字典
  identiPeople: { [name: string]: string[] } = {};
  // selectedItems: any[] = [];// 用于存储选中项的数组
  selectedArchive: string = "Archive";
  // archive_dict: Record<string, string> = {};
  archive_dict = {
    'Archive': 'Archive',
    'RemArc': 'RemArc'
  };

  // archiveList: string[] = ["Archive", "RemArc"];
  // archive_dict: Record<string, string> = {};

  querySubjects: string[] = []; //subjects of query
  queryObjects: string[] = [];// objects of query
  queryPeople: string[] = []; // people in query
  queryPlaces: string[] = []; // places in query

  showSubmitButton = false;

  constructor(private router: Router, private http: HttpClient, private nlpService: NlpService, private imageBasedSearch: ImageBasedSearchService,private dataSharingService: DataSharingServiceService) { }

  keywords: any; // 用于存储JSON数据的变量
  imageUrls: string[] = [];

  ngOnInit(): void {

  }
// 1. 先判断一句话中的keywords/objects
// 2. 如果判断出的keywords/objects在examples中，删除
// 3. 剩下的objects中的people搜索图片
// 4. keywords和place 展示出就行

  onSearch() {
    this.errorMessage = '';
    this.imagesPeople = [];
    this.imagesPlace = [];
    this.matchedsound = [];
    this.matchedObjects = [];
    this.matchedPeople = [];
    this.matchedPlace = [];
    this.sounds = [];
    this.identiPeople = {};
    this.identiPlace = [];
    this.intelPlace = [];
    // this.intelPeople =[];
    this.otherObjects = [];
    this.otherKeywords = [];
    // this.analyze();
    
    if (this.searchQuery) {
      const cleanedsound = this.sound.map(sound => this.cleanQuery(sound)); //清洗后的sound
      const cleanedObjects = this.objects.map(object => this.cleanQuery(object));
      const cleanedPlaces = this.places.map(place => this.cleanQuery(place));
      const cleanedPoliticians = this.politicians.map(politician => this.cleanQuery(politician));
      console.log('cleanedPlaces', cleanedPlaces);
      console.log('cleanedPoliticians', cleanedPoliticians);
      console.log('cleanedsound',cleanedsound);
      console.log('cleanedObjects',cleanedObjects);
      
      // const queryWords = this.searchQuery.toLowerCase().split(' ');
      // const querySequence = queryWords.join(' '); // 将查询单词合并为一个字符串序列
      // for (const place of this.places) {
      //   // 将地名分割成单词数组
      //   const placeWords = place.toLowerCase().split('_');
      //   // 将地名单词数组合并为一个字符串
      //   const placeString = placeWords.join(' ');
      //   // 检查查询序列是否作为连续子序列在地名字符串中
      //   if (placeString.includes(querySequence)) {
      //     this.matchedPlace.push(place);
      //   }
      // }

      // console.log(this.matchedPlace);

      // for (const politician of this.politicians) {
      //   // 将地名分割成单词数组
      //   const placeWords = politician.toLowerCase().split('_');
      //   // 将地名单词数组合并为一个字符串
      //   const placeString = placeWords.join(' ');

      //   // 检查查询序列是否作为连续子序列在地名字符串中
      //   if (placeString.includes(querySequence)) {
      //     this.matchedPeople.push(politician);
      //   }
      // }
      
      // console.log(this.matchedPeople);
      const result = this.analyzeQuery(this.searchQuery,cleanedsound,cleanedObjects,cleanedPlaces,cleanedPoliticians); //判断query中哪些词语属于sound/objects/places/politicians
      this.matchedsound = result.sound; // 匹配到的sound
      this.matchedObjects = result.objects;
      this.matchedPeople = this.mergeAndDeduplicate([...new Set(result.politicians)],this.matchedPeople);
      this.matchedPlace = this.mergeAndDeduplicate(result.places,this.matchedPlace);
      // console.log('Found sound:', this.matchedsound);
      // console.log('Found objects:', this.matchedObjects);
      // console.log('Found places:', result.places,this.matchedPlace);
      // console.log('Found politicians:', result.politicians);

      // 2. 如果判断出的keywords/objects在examples中，删除--begin
      this.nlpService.analyzeText(this.searchQuery).subscribe(response => {
        console.log('response', response);
        this.querySubjects = response.subjects; //主语
        this.queryObjects = response.objects; //宾语
        this.queryPeople = response.people; //人名
        this.queryPlaces = [...new Set(response.places)]; //地名  
        //再次判断地名是否在example中begin
        const querySequence = this.queryPlaces.map(str => str.toLocaleLowerCase().replace(/\s+/g, '').trim()); // 将查询单词合并为一个字符串序列
        console.log(querySequence)
        // for (const place of this.places) {
        //   // 将地名分割成单词数组
        //   const placeString = place.toLowerCase().split('_').join('');
        //   let isMatchFound = false;
        //   // 将地名单词数组合并为一个字符串
        //   for (const queryString of querySequence){
        //     // console.log(placeString,queryString);
        //     if (placeString.includes(queryString) && !isMatchFound) {
        //       isMatchFound = true;
        //     }
        //     // 如果已经找到匹配，就不需要继续检查其他单词
        //     if (isMatchFound) {
        //       break;
        //     }
        //   }
        //   if (isMatchFound) {
        //     this.matchedPlace.push(place);
        //   }
        // }

        // console.log(this.matchedPlace)
        console.log('this.otherKeywords',this.otherKeywords);
        this.queryPeople = this.mergeAndDeduplicate(this.queryPeople,this.querySubjects)

        this.otherKeywords = this.queryPlaces;
        console.log('this.otherKeywords',this.otherKeywords,this.queryPeople);
        this.otherKeywords = this.otherKeywords.filter(keyword=>
          !(this.queryPeople.includes(keyword))
        )
        console.log('queryPeople', this.queryPeople,this.querySubjects,this.queryObjects,this.queryPlaces);
        
        console.log('this.queryPlaces',this.queryPlaces);

        // this.otherObjects = this.mergeAndDeduplicate(this.otherObjects,this.matchedsound);
        this.otherObjects = this.mergeAndDeduplicate(this.otherObjects,this.queryObjects);
        console.log('this.otherObjects',this.otherObjects);
        this.otherObjects = this.otherObjects.filter(obj => //delete the verbs in the objects
          !response.verbs.includes(obj) && !this.objects.includes(obj)
        )
        console.log('this.otherObjects',this.otherObjects);
        // 转换cleanedPoliticians为正则表达式数组
        
        // console.log('regexPatterns',regexPatterns);
        console.log('Before filtering queryPeople:', this.queryPeople);
        // 创建用于匹配cleanedPoliticians中每个人名的正则表达式数组
        const regexPatterns = cleanedPoliticians.map(name => 
          new RegExp(name.split(/\s+/).join('|').replace(/^\w/, '\\b$&\\b'), 'gi')
        );

        // 过滤this.queryPeople数组
        this.queryPeople = this.queryPeople.filter(queryPerson => {
          // 检查当前queryPerson是否不被任何正则表达式匹配
          return !regexPatterns.some(pattern => pattern.test(queryPerson));
        });
        console.log('After filtering queryPeople:', this.queryPeople);

        this.querySubjects = this.querySubjects.filter(subject => !cleanedsound.includes(subject));
        // 检查并删除存在于this.objects中的元素
        this.queryObjects = this.queryObjects.filter(object => !cleanedObjects.includes(object));
        // 检查并删除存在于this.places中的元素
        this.queryPlaces = this.queryPlaces.filter(place => !cleanedPlaces.includes(place));
        console.log(this.queryPeople);
        console.log('Updated queryPeople', this.queryPeople, 'Updated querySubjects', this.querySubjects, 'Updated queryObjects', this.queryObjects, 'Updated queryPlaces', this.queryPlaces);
        console.log(this.matchedPeople,this.queryPeople,this.matchedObjects,this.matchedPlace,this.matchedsound);
        if (this.matchedPeople.length > 0 && this.matchedsound.length === 0) { //如果有能匹配到的face和sound。sound不搜索不返回
          console.log(this.matchedPeople,'search image from the internet')
          this.matchedPeople.forEach(politician => this.getFirstImage(politician, 'politicians', false));
        } else if (this.matchedPeople.length === 0 && this.queryPeople.length>0 && this.matchedObjects.length===0 && this.matchedPlace.length===0 && this.sounds.length===0) {//如果没有face example。从网上下载face对应的图片
          console.log(this.queryPeople);
          this.queryPeople.forEach((name: string) => {
            // this.getImagefromInte(name, 'people');
            this.fetchAndSubscribeToImages(name, 'people');
          });
        }
        if (this.matchedPeople.length > 0 && this.matchedsound.length > 0) {//如果有能匹配到的face和sound。sound搜索到不返回
          console.log(this.matchedPeople);
          this.matchedPeople.forEach(politician => this.getFirstImage(politician, 'politicians', true));
        }
        if([...new Set(this.matchedPlace)].length>0){
          console.log([...new Set(this.matchedPlace)]);
          [...new Set(this.matchedPlace)].forEach(place => this.getFirstImage(place,'places_belfast',false));
        }
      });
      // 2. 如果判断出的keywords/objects在examples中，删除--end
    } else {
      this.errorMessage = 'Please enter a search query.';
    }
    this.showSubmitButton = true;
  }

  //判断query中哪些词语属于sound/objects/places/politicians
  analyzeQuery(query: string,cleanedsound: string[],cleanedObjects: string[],cleanedPlaces:string[],cleanedPoliticians:string[]): { sound: string[], objects: string[], places: string[], politicians: string[] } {
    const cleanedQuery = this.cleanQuery(query);
    console.log('cleanedQuery', cleanedQuery);
    const queryWords = cleanedQuery.split(/\s+/);

    const matchedsound: string[] = [];
    const matchedObjects: string[] = [];
    const matchedPlaces: string[] = [];
    const matchedPoliticians: string[] = [];
    
    let i = 0;
    while (i < queryWords.length) {
      let matched = false;
      for (let length = queryWords.length - i; length > 0; length--) {
        const subQuery = queryWords.slice(i, i + length).join(" ");
        // console.log('subQuery',subQuery);
        if (cleanedsound.includes(subQuery)) {
          matchedsound.push(subQuery);
          i += length;
          matched = true;
          break;
        } else if (cleanedObjects.includes(subQuery)) {
          matchedObjects.push(subQuery);
          i += length;
          matched = true;
          break;
        } else if (cleanedPlaces.includes(subQuery)) {
          matchedPlaces.push(this.places[cleanedPlaces.indexOf(subQuery)]);
          i += length;
          matched = true;
          break;
        }
      }
      if (!matched) {
        i++;
      }
    }
    queryWords.forEach(word => {
      if (cleanedPoliticians.some(politician => politician.split(/\s+/).includes(word))) {
        matchedPoliticians.push(this.politicians[cleanedPoliticians.findIndex(politician => politician.split(/\s+/).includes(word))]);
      }
    });
    return { sound: matchedsound, objects: matchedObjects, places: matchedPlaces, politicians: matchedPoliticians };
  }

  getFirstImage(folder_name: string, folder: string, sound: boolean) {
    const apiUrl = `${this.API_BASE_URL}${this.CONFIG["API_PREFIX"]}/get-first-image`;
    // const apiUrl = 'https://localhost:8000/api/get-first-image'
    const params = { folder_name: folder_name, folder: folder, sound: sound };
    console.log(params);
    console.log('this.imagesPlace',this.imagesPlace);
    this.http.get(apiUrl, { params }).subscribe(
      (response: any) => {
        if (folder == 'politicians') {
          this.imagesPeople.push(response.imageUrl);
          if (response.soundUrl) {
            this.sounds.push(response.soundUrl);
          }
        }
        if (folder == 'places_belfast') {
          this.imagesPlace.push(response.imageUrl);
          if (response.soundUrl) {
            this.sounds.push(response.soundUrl);
          }
        }
      },
      (error) => {
        console.error('Error fetching image:', error);
      }
    );
  }

  //search images from google.com
  fetchAndSubscribeToImages(query: string, category: string): void {
    const count = 5;
    console.log('Fetching images');
    const encodedQuery = encodeURIComponent('politician'+ query);
    const url = `${this.API_BASE_URL}${this.CONFIG["API_PREFIX"]}/get-images?query=${encodedQuery}&count=${count}`;
    console.log('Fetching images from:', url);
    // this.identiPeople[query] = []
    // console.log(this.identiPeople)
    this.http.get<ImageResponse>(url).subscribe({
      next: (response) => {
        this.imageUrls = response.image_urls;
        console.log('Image URLs fetched:', this.imageUrls);
        if (category === 'people') {
          // this.identiPeople['name'] = imageUrls;
          this.identiPeople[query] = this.imageUrls;
          console.log('identiPeople', this.identiPeople);
        }
      },
      error: (error) => {
        console.error('Error fetching image URLs:', error);
        if (error.status === 422) {
          // Handle the 422 Unprocessable Entity error specifically
          console.error('Validation error:', error.error);
        }
      }
    });
  }

  // 区分query中哪些词语是objects,keywords, places & people
  identifyEntities(query: string): { people: string[], places: string[], others: string[] } {
    let doc = nlp(query);
    // Extract people and places
    let people = doc.people().out('array');
    let places = doc.places().out('array');
    // Remove matched people and places from the query
    people.forEach((person: string) => {
      query = query.replace(new RegExp(`\\b${person}\\b`, 'gi'), '');
    });
    places.forEach((place: string) => {
      query = query.replace(new RegExp(`\\b${place}\\b`, 'gi'), '');
    });
    // Create a new document with the modified query
    doc = nlp(query);

    // Extract all other entities
    let entities: { [key: string]: string[] } = {
      // dates: doc.dates().out('array'),
      organizations: doc.organizations().out('array'),
      acronyms: doc.acronyms().out('array'),
      topics: doc.topics().out('array'),
      nouns: doc.nouns().out('array'),
      pronouns: doc.pronouns().out('array')
    };

    // Flatten all other entities into 'others' array
    let others: string[] = [];
    Object.keys(entities).forEach(key => {
      others = others.concat(entities[key]);
    });

    // Remove duplicates from 'others' array
    let uniqueOthers = Array.from(new Set(others));

    // Filter out any duplicates between people, places, and others
    uniqueOthers = uniqueOthers.filter(entity => !people.includes(entity) && !places.includes(entity));

    return {
      people: people,
      places: places,
      others: uniqueOthers
    };
  }

  saveData(sound: string[], objects: string[], imageUrl: string | undefined) {
    const saveApiUrl = `${this.API_BASE_URL}${this.CONFIG["API_PREFIX"]}/save-data`;
    const body = { sound: sound, objects: objects, imageUrl: imageUrl };
    this.http.post(saveApiUrl, body).subscribe(
      (response: any) => {
        console.log('Data saved successfully:', response);
      },
      (error) => {
        console.error('Error saving data:', error);
      }
    );
  }

  // 清洗query
  cleanQuery(query: string): string {
    return query.replace(/[^\w\s']/g, "").replace(/_/g, " ").trim().toLowerCase();
  }

  onArchiveSelectionChange(): void {
    console.log('Selected Archive:', this.selectedArchive);
  }
  getObjectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  toggleSelection(group: string, key: string = '', index: number = -1) {
    if (group === 'identiPeople') {
      // Ensure that identiPeople[key] is an array
      if (!Array.isArray(this.selectedStates.identiPeople[key])) {
        this.selectedStates.identiPeople[key] = [];
      }

      // Ensure the array is large enough to handle the index
      while (this.selectedStates.identiPeople[key].length <= index) {
        this.selectedStates.identiPeople[key].push(false);
      }

      // Toggle the boolean value at the specified index
      this.selectedStates.identiPeople[key][index] = !this.selectedStates.identiPeople[key][index];
    } else if (group === 'sounds') {
      this.selectedStates.sounds[index] = !this.selectedStates.sounds[index];
    } else if (group == 'matchedsound') {
      this.selectedStates.matchedsound[index] = !this.selectedStates.matchedsound[index];
    } else if (group == 'matchedObjects') {
      this.selectedStates.matchedObjects[index] = !this.selectedStates.matchedObjects[index];
    } else if (group == 'imagesPeople') {
      this.selectedStates.imagesPeople[index] = !this.selectedStates.imagesPeople[index];
    } else if (group == 'imagesPlace') {
      this.selectedStates.imagesPlace[index] = !this.selectedStates.imagesPlace[index];
    } else if (group == 'otherKeywords') {
      this.selectedStates.otherKeywords[index] = !this.selectedStates.otherKeywords[index];
    } else if (group == 'otherObjects') {
      this.selectedStates.otherObjects[index] = !this.selectedStates.otherObjects[index];
    }
  }

  //select end
  hasSelected(): boolean {
    return Object.values(this.selectedStates.identiPeople).some(arr => arr.some(selected => selected)) ||
      this.selectedStates.matchedsound.some(selected => selected) ||
      this.selectedStates.matchedObjects.some(selected => selected) ||
      this.selectedStates.imagesPeople.some(selected => selected) ||
      this.selectedStates.imagesPlace.some(selected => selected) ||
      this.selectedStates.sounds.some(selected => selected) ||
      this.selectedStates.otherKeywords.some(selected => selected) ||
      this.selectedStates.otherObjects.some(selected => selected);
  }

  mergeImages(): string[] {
    // 创建一个空数组用于存放合并后的图片URL
    let allImages: string[] = [];

    // 将imagesPeople和imagesPlace直接添加到allImages数组中
    allImages = allImages.concat(this.imagesPeople, this.imagesPlace);

    // 遍历identiPeople对象，并将每个姓名对应的图片URL数组添加到allImages中
    for (let name in this.identiPeople) {
      allImages = allImages.concat(this.identiPeople[name]);
    }

    // 返回合并后的图片数组
    return allImages;
  }

  // hideProgressBar() {
  //   this.showProgressBar = false;
  //   this.applyBlurEffect = false;
  // }

  submitSelections(): void {
    const selectedImagesPeople = this.imagesPeople.filter((_, i) => this.selectedStates.imagesPeople[i]);
    const selectedImagesPlace = this.imagesPlace.filter((_, i) => this.selectedStates.imagesPlace[i]);
    const selectedIdentiPeople = Object.keys(this.identiPeople).reduce((acc, name) => {
      const selected = this.selectedStates.identiPeople[name];
      const selectedUrls = this.identiPeople[name].filter((_, i) => selected[i]);
      if (selectedUrls.length > 0) {
        // 确保selectedUrls是一个数组，并且acc也是一个数组
        acc = acc.concat(selectedUrls);
      }
      return acc;
    }, [] as string[]);

    // 合并所有被挑选的图片URL
    const allSelectedImages = selectedImagesPeople.concat(selectedImagesPlace, selectedIdentiPeople);

    // 打印或处理所有被挑选的图片URL
    console.log('All selected images:', allSelectedImages);

    const selectedSounds = this.sounds.filter((_, i) => this.selectedStates.sounds[i]);
    console.log('All selected sounds:', selectedSounds);

     // 筛选和合并其他类型的数据
     const selectedMatchedSound = this.matchedsound.filter((_, i) => this.selectedStates.matchedsound[i]);
     const selectedMatchedObjects = this.matchedObjects.filter((_, i) => this.selectedStates.matchedObjects[i]);
     const selectedOtherKeywords = this.otherKeywords.filter((_, i) => this.selectedStates.otherKeywords[i]);
     const selectedOtherObjects = this.otherObjects.filter((_, i) => this.selectedStates.otherObjects[i]);

     const allSelectedWords = [
      ...selectedMatchedSound,
      ...selectedMatchedObjects,
      ...selectedOtherObjects,
     ];

     console.log('All selected words:', allSelectedWords);
      // this.imageBasedSearch.searchV2(allSelectedImages, selectedSounds, selectedOtherKeywords, allSelectedWords,[],[],[],[],this.selectedArchive)
      //   .then(response => {
      //     console.log(response);
      //     const data = response;
      //     this.dataSharingService.sharedData = data;
      //     // this.dataSharingService.configData = this.archiveList;
      //     this.dataSharingService.selectedArchive = this.selectedArchive;
      //     // this.hideProgressBar();
      //     this.router.navigateByUrl('/searchResults');
      //   })
      //   .catch(error => {
      //     console.error(error);
      //     // this.hideProgressBar(); // Ensure the progress bar is hidden in case of an error
      //     // this.openSoundEventDialog("Error from the API server!");
      //   });
    }; // Adjust the delay time (milliseconds) as needed, e.g., 100ms
  mergeAndDeduplicate(people:string[], subjects:string[]):string[] {
    // 将people和subjects合并为一个数组
    const allNames = people.concat(subjects);
    
    // 创建一个映射，键是小写的名字，值是原始名字
    const nameMap = new Map(allNames.map(name => [name.toLowerCase(), name]));
  
    // 遍历映射中的所有项
    for (let [lowerName, name] of nameMap) {
      // 对于每个名称，检查其他所有名称是否是其子集
      for (let [otherLowerName, otherName] of nameMap) {
        if (lowerName === otherLowerName) continue; // 跳过相同的项
  
        // 如果当前名称是另一个名称的子集，并且另一个名称更长，则删除当前名称
        if (otherLowerName.includes(lowerName) && otherName.length > name.length) {
          nameMap.delete(lowerName);
          break; // 跳出循环，因为当前名称已被删除
        }
        // 如果另一个名称是当前名称的子集，并且当前名称更长，则删除另一个名称
        else if (lowerName.includes(otherLowerName) && name.length > otherName.length) {
          nameMap.delete(otherLowerName);
        }
      }
    }
  
    // 返回映射中的所有值，即合并后的唯一名称列表
    return Array.from(nameMap.values());
  }

  refreshImagesForAllPeople() {
    console.log(this.queryPeople);
    this.queryPeople.forEach((name: string) => {
      // this.getImagefromInte(name, 'people');
      this.fetchAndSubscribeToImages(name, 'people');
    });
    // peopleNames.forEach((name) => {
    //   this.getNewImages(name);
    // });
    console.log('click the refresh button!')
  }
  // Function to hide the progress bar and remove blur effect
 
}