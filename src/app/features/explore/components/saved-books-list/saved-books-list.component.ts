import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-saved-books-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './saved-books-list.component.html',
  styleUrl: './saved-books-list.component.scss'
})
export class SavedBooksListComponent {
  savedBooksArray: any[] = [];
  selectedBook: any = null;

  ngOnInit() {
    this.loadSavedBooks();
  }

  // Load saved books from local storage
  loadSavedBooks() {
    const storedBooks = JSON.parse(localStorage.getItem('savedBooks') || '{}');
    
    // Convert object to array for easy iteration
    this.savedBooksArray = Object.keys(storedBooks).map(bookId => ({
      id: bookId,
      content: storedBooks[bookId].content,
      metadata: storedBooks[bookId].metadata
    }));
  }

  // View saved book details
  viewSavedBook(book: any) {
    this.selectedBook = book;
  }

  // Close modal
  closeModal() {
    this.selectedBook = null;
  }
}
