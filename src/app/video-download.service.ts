import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class VideoDownloadService {
  constructor(private http: HttpClient) {}

  downloadVideo(url: string, starttime: string): Observable<string> {
    const headers = new HttpHeaders({
      'range': 'bytes=' + starttime + '-',
    });

    return this.http.get(url, { responseType: 'blob', headers: headers }).pipe(
      map((blobData) => {
        const videoBlob = new Blob([blobData], { type: 'video/mp4' });
        const videoUrl = URL.createObjectURL(videoBlob);
        return videoUrl;
      })
    );
  }
}
