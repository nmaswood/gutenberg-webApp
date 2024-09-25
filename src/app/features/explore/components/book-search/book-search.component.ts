import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


import { BookSearchService } from '../../services/book-search.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BookMetadata } from '../../models/books-search.interface';
import { TextAnalysisService } from '../../services/text-analysis.service';

@Component({
  selector: 'app-book-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './book-search.component.html',
  styleUrl: './book-search.component.scss',
})
export class BookSearchComponent {
  bookId: string = '';
  bookContent: string = '';
  bookMetadata: SafeHtml = '';
  bookMetadataEmpty:boolean = false;
  text: string = '';
  analysisResults: any;
  sentimentAnalysisResults: any;
  summaryResults: any;
  activeTab: string = 'content';  // Default to book content
  isLoading: boolean = false;
  isBookSaved: boolean = false;

  title: string | null = null;
  author: string | null = null;
  summary: string | null = null;
  imageUrl: string | null = null;

  constructor(private bookService: BookSearchService, private sanitizer: DomSanitizer, private textAnalysisService: TextAnalysisService) {}


  fetchBook() {
    this.isLoading = true;
    this.bookService.getBookContent(this.bookId).subscribe(
      (response) => {
        this.bookContent = response.content;
        this.text = response.content; // Set the text for analysis
        this.performAnalysis(); // Automatically analyze the text
      },
      (error) => {
        console.error('Error fetching book content', error);
      }
    );

    this.bookService.getBookMetadata(this.bookId).subscribe(
      (response) => {
        this.bookMetadata = this.sanitizer.bypassSecurityTrustHtml(response.metadata);
        this.parseMetadata(response.metadata);
        this.saveLatestSearch(this.bookId);
        this.checkIfBookIsSaved(this.bookId);
        if(this.bookMetadata ){
          this.bookMetadataEmpty = true;
        }
      },
      (error) => {
        console.error('Error fetching book metadata', error);
        this.bookMetadataEmpty = true;
      }
    ).add(() => {
      this.isLoading = false;
    });
  }

  checkIfBookIsSaved(bookId: string) {
    const storedBooks = JSON.parse(localStorage.getItem('savedBooks') || '{}');
    this.isBookSaved = storedBooks[bookId] !== undefined;
  }

  performAnalysis() {
    this.isLoading = true;
    // Perform text analysis
    this.textAnalysisService.analyzeCharacters(this.text).subscribe(
      (result) => {
        this.analysisResults = result;
      },
      (error) => {
        console.error('Error analyzing characters', error);
      }
    );

    // Perform sentiment analysis
    this.textAnalysisService.analyzeSentiment(this.text).subscribe(
      (result) => {
        this.sentimentAnalysisResults = result;
      },
      (error) => {
        console.error('Error analyzing sentiment', error);
      }
    );

    // Perform text summarization
    this.textAnalysisService.summarizeText(this.text).subscribe(
      (result) => {
        this.summaryResults = result;
      },
      (error) => {
        console.error('Error summarizing text', error);
      }
    ).add(() => {
      this.isLoading = false;
    });
  }

  parseMetadata(htmlString: string) {
    // Create a new DOMParser to parse the HTML string
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    // Extract the book title
    this.title = doc.querySelector('h1[itemprop="name"]')?.textContent ?? null;

    // Extract the author from the table
    this.author = doc.querySelector('table.bibrec tr:nth-child(1) td a')?.textContent ?? null;

    // Extract the summary from the table
    this.summary = doc.querySelector('table.bibrec tr:nth-child(2) td')?.textContent ?? null;

    // Extract the image URL
    this.imageUrl = doc.querySelector('div#cover img.cover-art')?.getAttribute('src') ?? null;
  }

  getDescription(entityGroup: string): string {
    switch (entityGroup) {
      case 'MISC':
        return 'Miscellaneous entities that do not fit into other categories.';
      case 'ORG':
        return 'Organizations or companies.';
      default:
        return 'No description available.';
    }
  }


  // saveBook(bookId: string) {
  //   const storedBooks = JSON.parse(localStorage.getItem('savedBooks') || '{}');
    
  //   // Save both content and metadata
  //   storedBooks[bookId] = {
  //     content: this.bookContent,
  //     metadata: {
  //       title: this.title, // Replace with actual title field from metadata
  //       image: this.imageUrl, // Replace with actual image URL field
  //       author: this.author, // Replace with actual author field
  //       bookId: bookId
  //     }
  //   };
  
  //   localStorage.setItem('savedBooks', JSON.stringify(storedBooks));
  //   this.showToast('Book saved!');
  // }

  saveBook(bookId: string) {
    const storedBooks = JSON.parse(localStorage.getItem('savedBooks') || '{}');
  
    if (storedBooks[bookId]) {
      // Book is already saved, so unsave it
      delete storedBooks[bookId];
      this.showToast('Book removed from saved!');
      this.isBookSaved = false; // Update the state
    } else {
      // Save the book
      storedBooks[bookId] = {
        content: this.bookContent,
        metadata: {
          title: this.title,
          image: this.imageUrl,
          author: this.author,
          bookId: bookId
        }
      };
      this.showToast('Book saved!');
      this.isBookSaved = true; // Update the state
    }
    
    localStorage.setItem('savedBooks', JSON.stringify(storedBooks));
  }

  saveLatestSearch(bookId: string) {
    // Assuming you've already fetched the metadata (title, image, author) and saved in `bookMetadata`
    const bookDetails = {
      title: this.title, // Replace with actual title field from metadata
      image: this.imageUrl, // Replace with actual image URL field
      author: this.author, // Replace with actual author field
      bookId: bookId
    };
  
    // Retrieve current list of saved books
    const savedBooks = JSON.parse(localStorage.getItem('latestBooks') || '[]');
  
    // Add new book to the list (prevent duplicates based on bookId)
    const updatedBooks = savedBooks.filter((book: any) => book.bookId !== bookId);
    updatedBooks.push(bookDetails);
  
    // Save updated list back to localStorage
    localStorage.setItem('latestBooks', JSON.stringify(updatedBooks));
  }

  showToast(message:string) {
    const toast = document.getElementById('toast');
    if (!toast) {
      console.warn('Toast element not found!');
      return; // Exit if the toast element is not found
    }
    toast.textContent = message;
    toast.classList.remove('hidden'); // Show the toast
    toast.classList.remove('translate-y-full'); // Prepare to show
  
    // Animate into view
    setTimeout(() => {
      toast.classList.add('translate-y-0'); // Add translate class for entry
    }, 10); // Small delay for transition
  
    // Hide the toast after 3 seconds
    setTimeout(() => {
      toast.classList.add('translate-y-full'); // Animate out
      setTimeout(() => {
        toast.classList.add('hidden'); // Hide after animation
        toast.classList.remove('translate-y-0'); // Reset for next use
      }, 300); // Match duration of the animation
    }, 3000); // Show for 3 seconds
  }
}
