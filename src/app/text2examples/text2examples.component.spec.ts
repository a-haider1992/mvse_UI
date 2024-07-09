import { Component, OnInit } from '@angular/core';
import { ImageService } from '../services/image.service';

@Component({
  selector: 'app-text2examples',
  templateUrl: './text2examples.component.html',
  styleUrls: ['./text2examples.component.scss']
})
export class Text2examplesComponent implements OnInit {

  searchQuery: string = ''; // 用来存储输入框的值
  keywords: string[] = ['Speech', 'Male speech', 'man speaking', 'Female speech', 'woman speaking', 'Child speech', 'kid speaking', 'Conversation'];
  objects: string[] = ["person", "bicycle", "car"];
  places_folders: string[] = [
    "queen's_university_belfast",
    "shankill_road",
    "bank_buildings,_belfast",
    "europa_hotel",
    "giant's_causeway",
    "andersonstown",
    "harland_&_wolff_shipyard",
    "george_best_belfast_city_airport"
  ]; // Folder names

  cleanedPlacesFolders: string[] = [];
  imageUrl: string | undefined;

  constructor(private imageService: ImageService) {}

  ngOnInit() {
    // 初始化并清理文件夹名称
    this.cleanedPlacesFolders = this.places_folders.map(folder => this.cleanQuery(folder));
  }

  onSearch() {
    console.log('click the search');
    if (this.searchQuery) {
      console.log(this.searchQuery);
      const result = this.analyzeQuery(this.searchQuery);
      console.log('Found keywords:', result.keywords);
      console.log('Found objects:', result.objects);
      console.log('Found folders:', result.folders);

      if (result.folders.length > 0) {
        this.getFirstImage(result.folders[0]);
      } else {
        console.error(`Error: No matching folder found for query '${this.searchQuery}'`);
      }
    }
  }

  analyzeQuery(query: string): { keywords: string[], objects: string[], folders: string[] } {
    const cleanedQuery = this.cleanQuery(query);
    const queryWords = cleanedQuery.split(/\s+/);

    const matchedKeywords: string[] = [];
    const matchedObjects: string[] = [];
    const matchedFolders: string[] = [];

    const cleanedKeywords = this.keywords.map(keyword => this.cleanQuery(keyword));
    const cleanedObjects = this.objects.map(object => this.cleanQuery(object));

    let i = 0;
    while (i < queryWords.length) {
      let matched = false;

      // 尝试匹配最长的关键词或对象
      for (let length = queryWords.length - i; length > 0; length--) {
        const subQuery = queryWords.slice(i, i + length).join(" ");

        if (cleanedKeywords.includes(subQuery)) {
          matchedKeywords.push(subQuery);
          i += length;
          matched = true;
          break;
        } else if (cleanedObjects.includes(subQuery)) {
          matchedObjects.push(subQuery);
          i += length;
          matched = true;
          break;
        } else if (this.cleanedPlacesFolders.includes(subQuery)) {
          matchedFolders.push(subQuery);
          i += length;
          matched = true;
          break;
        }
      }

      if (!matched) {
        i++;
      }
    }

    return { keywords: matchedKeywords, objects: matchedObjects, folders: matchedFolders };
  }

  getFirstImage(folder: string) {
    this.imageService.getFirstImage(folder).subscribe(
      response => {
        this.imageUrl = response.imageUrl;
      },
      error => {
        console.error('Error fetching image:', error);
      }
    );
  }

  cleanQuery(query: string): string {
    return query.replace(/[^\w\s]/g, "").replace(/_/g, " ").trim().toLowerCase();
  }
}
