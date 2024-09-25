import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss'
})
export class BookListComponent {
  savedBooks: any[] = [];

  ngOnInit(): void {
    this.getLatestSearches();
  }

  getLatestSearches() {
    this.savedBooks = JSON.parse(localStorage.getItem('latestBooks') || '[]');
  }
}
