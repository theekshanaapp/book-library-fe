import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { BookService, Book } from '../../services/book.service';
import { AuthorService, Author } from '../../services/author.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-book.component.html',
  styleUrl: './add-book.component.scss'
})
export default class AddBookComponent implements OnInit {
  fb = inject(FormBuilder);
  router = inject(Router);
  route = inject(ActivatedRoute);

  bookForm !: FormGroup;
  authors: Author[] = [];
  bookId?: number;

  constructor(
    private bookService: BookService,
    private authorService: AuthorService,
  ) {
    this.bookForm = this.fb.group({
      name: ['', Validators.required],
      isbn: ['', Validators.required],
      author: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.authorService.getAuthors().subscribe((authors) => {
      this.authors = authors;
    });

    this.bookId = +this.route.snapshot.paramMap.get('id')!;
    if (this.bookId) {
      this.loadBook(this.bookId);
    }
  }

  loadBook(id: number): void {
    this.bookService.getBookById(id).subscribe((book) => {
      this.bookForm.patchValue({
        name: book.name,
        isbn: book.isbn,
        author: book.author.id
      });
    });
  }

  save(): void {
    if (this.bookForm.valid) {
      const newBook: Book = {
        name: this.bookForm.get('name')?.value,
        isbn: this.bookForm.get('isbn')?.value,
        author: {
          id: this.bookForm.get('author')?.value
        }
      };

      if (this.bookId) {
        this.bookService.updateBook(this.bookId, newBook).subscribe(() => {
          this.router.navigate(['/book']);
        }, (error) => {
          console.error('Error updating book', error);
        });
      } else {
        this.bookService.createBook(newBook).subscribe(() => {
          this.router.navigate(['/book']);
        }, (error) => {
          console.error('Error creating book', error);
        });
      }
    }
  }
}

