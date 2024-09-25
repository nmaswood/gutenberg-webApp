import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, RouterLink} from '@angular/router';
import { BookSearchComponent } from './features/explore/components/book-search/book-search.component';
import { BookListComponent } from './features/explore/components/book-list/book-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterLink, RouterModule, CommonModule,BookSearchComponent,BookListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'gutenberg-explorer';
}
