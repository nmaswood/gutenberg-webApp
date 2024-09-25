import { Routes } from '@angular/router';
import { BookSearchComponent } from './features/explore/components/book-search/book-search.component';
import { BookListComponent } from './features/explore/components/book-list/book-list.component';
import { SavedBooksListComponent } from './features/explore/components/saved-books-list/saved-books-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  { path: 'search', component: BookSearchComponent },
  { path: 'books', component: BookListComponent },
  { path: 'saved-books', component: SavedBooksListComponent },
];
