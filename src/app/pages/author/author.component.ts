import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthorService, Author } from '../../services/author.service';
import { Observable } from 'rxjs'

@Component({
  selector: 'app-author',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule],
  templateUrl: './author.component.html',
  styleUrl: './author.component.scss'
})
export default class AuthorComponent implements OnInit{

  pagedItems: Author[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 6;
  authors$: Observable<Author[]> = new Observable<Author[]>();
  
  constructor(private router: Router, private authorService: AuthorService) {}

  ngOnInit(): void {
    this.fetchAuthors();
  }

  fetchAuthors(): void {
    this.authors$ = this.authorService.getAuthors();
    this.authors$.subscribe((authors) => {
      this.pagedItems = authors.slice(0, this.pageSize);
      this.totalPages = Math.ceil(authors.length / this.pageSize);
    }, (error) => {
      console.error('Error fetching authors', error);
    });
  }

  updatePagedItems(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.authors$.subscribe((authors) => {
      this.pagedItems = authors.slice(startIndex, startIndex + this.pageSize);
    });
  }

  deleteAuthor(author: Author): void {
    if (confirm(`Are you sure you want to delete ${author.firstName}?`)) {
      this.authorService.deleteAuthor(author.id).subscribe(() => {
        this.fetchAuthors();
      }, error => {
        console.error('Error deleting author', error);
      });
    }
  }

  updateAuthor(author: Author): void {
    this.router.navigate(['/update-author', author.id]);
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