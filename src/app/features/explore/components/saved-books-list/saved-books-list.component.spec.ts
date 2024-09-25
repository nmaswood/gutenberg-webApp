import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedBooksListComponent } from './saved-books-list.component';

describe('SavedBooksListComponent', () => {
  let component: SavedBooksListComponent;
  let fixture: ComponentFixture<SavedBooksListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavedBooksListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SavedBooksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
