import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { apiUrl } from '../api.url';

export interface Author {
  id: number;
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  private apiUrl =  apiUrl.serviceApi + 'authors';

  constructor(private http: HttpClient) {}

  getAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>(this.apiUrl)
      .pipe(
        catchError((error) => {
          console.error('Error fetching authors', error);
          throw error;
        })
      );
  }

  getAuthorById(id: number): Observable<Author> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Author>(url);
  }

  createAuthor(author: Author): Observable<void> {
    return this.http.post<void>(this.apiUrl, author);
  }

  updateAuthor(author: Author): Observable<void> {
    const url = `${this.apiUrl}/${author.id}`;
    return this.http.put<void>(url, author);
  }

  deleteAuthor(authorId: number): Observable<void> {
    const url = `${this.apiUrl}/${authorId}`;
    return this.http.delete<void>(url);
  }

}
