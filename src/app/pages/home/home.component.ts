import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Product, BookModalComponent } from '../../components/book-modal/book-modal.component';
import { BookService, Book } from '../../services/book.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, BookModalComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export default class BooksComponent {

  books: Book[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 50;
  books$: Observable<Book[]> = new Observable<Book[]>();

  isModalOpen = false;
  selectedProduct: Book | undefined;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.fetchBooks();
  }

  fetchBooks(): void {
    this.books$ = this.bookService.getBooks(this.currentPage - 1, this.pageSize);
    this.books$.subscribe((books) => {
      this.books = books.slice(0, this.pageSize);
      this.totalPages = Math.ceil(books.length / this.pageSize);
    }, (error) => {
      console.error('Error fetching books', error);
    });
  }

  updatePagedItems(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.books$.subscribe((books) => {
      this.books = books.slice(startIndex, startIndex + this.pageSize);
    });
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

  openModal(book: Book): void {
    this.isModalOpen = true;
    this.selectedProduct = book;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedProduct = undefined;
  }

}
