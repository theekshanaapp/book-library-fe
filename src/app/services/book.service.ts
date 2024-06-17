import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl } from '../api.url';

export interface Book {
  id?: number;
  name: string;
  isbn: string;
  author: {
    id: number;
    firstName?: string;
    lastName?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private apiUrl =  apiUrl.serviceApi + 'books';

  constructor(private http: HttpClient) { }

  getBooks(page: number, size: number): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  createBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  updateBook(id: number, book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${id}`, book);
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
