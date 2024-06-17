import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BookService, Book } from '../../services/book.service';
import { Observable } from 'rxjs'

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss'
})
export default class BooksComponent implements OnInit{

  pagedItems: Book[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 6;
  books$: Observable<Book[]> = new Observable<Book[]>();

  constructor(private router: Router, private bookService: BookService) {}

  ngOnInit(): void {
    this.fetchBooks();
  }

  fetchBooks(): void {
    this.books$ = this.bookService.getBooks(this.currentPage - 1, this.pageSize);
    this.books$.subscribe((books) => {
      this.pagedItems = books.slice(0, this.pageSize);
      this.totalPages = Math.ceil(books.length / this.pageSize);
    }, (error) => {
      console.error('Error fetching books', error);
    });
  }

  updatePagedItems(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.books$.subscribe((books) => {
      this.pagedItems = books.slice(startIndex, startIndex + this.pageSize);
    });
  }

  deleteBook(book: Book): void {
    if (confirm(`Are you sure you want to delete ${book.name}?`)) {
      this.bookService.deleteBook(book.id!).subscribe(() => {
        this.fetchBooks();
      }, error => {
        console.error('Error deleting book', error);
      });
    }
  }

  updateBook(book: Book): void {
    this.router.navigate(['/update-book', book.id]);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedItems();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedItems();
    }
  }
}