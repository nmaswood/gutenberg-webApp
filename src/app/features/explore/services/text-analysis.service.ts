import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class TextAnalysisService {

  private apiUrl = 'http://localhost:5002/api';

  constructor(private http: HttpClient) {}

  analyzeCharacters(text: string) {
    return this.http.post(`${this.apiUrl}/analyze-characters`, { text });
  }

  detectLanguage(text: string) {
    return this.http.post(`${this.apiUrl}/detect-language`, { text });
  }

  analyzeSentiment(text: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/analyze-sentiment`, { text });
  }

  summarizeText(text: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/summarize-text`, { text });
  }
}
