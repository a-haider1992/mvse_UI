import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface NLPResponse {
  subjects: string[];
  objects: string[];
  people: string[];
  places: string[];
  verbs:string[];
}

@Injectable({
  providedIn: 'root'
})


export class NlpService {
  private API_BASE_URL = window.location.port;

  private CONFIG = {
    API_PREFIX: '/api',
    // 其他配置...
  };
  private apiUrl = 'http://localhost:8000/api/analyze-text/';
  constructor(private http: HttpClient) { }

  analyzeText(text: string): Observable<NLPResponse> {
    return this.http.post<NLPResponse>(this.apiUrl, { text });
  }
}
