import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BookMetadata } from '../models/books-search.interface';

@Injectable({
  providedIn: 'root'
})
export class BookSearchService {
  baseUrl = 'http://localhost:5002/api/book';
  constructor(private http: HttpClient) {}
  

  // Method to fetch book content
  getBookContent(bookId: string): Observable<{ content: string }> {
    return this.http.get<{ content: string }>(`${this.baseUrl}/${bookId}/content`);
  }

  // Method to fetch book metadata
  getBookMetadata(bookId: string): Observable<BookMetadata> {
    return this.http.get<BookMetadata>(`${this.baseUrl}/${bookId}/metadata`);
  }
}
