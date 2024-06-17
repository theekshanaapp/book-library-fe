import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Author, AuthorService } from '../../services/author.service';

@Component({
  selector: 'app-add-author',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './add-author.component.html',
  styleUrl: './add-author.component.scss'
})
export default class AddAuthorComponent implements OnInit {
  fb = inject(FormBuilder);
  router = inject(Router);

  authorForm !: FormGroup;
  isEditMode = false;
  authorId: number | undefined;

  constructor(private authorService: AuthorService, private route: ActivatedRoute,) {
    this.authorForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });
  }
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.authorId = +params['id'];
        this.loadAuthorDetails(this.authorId);
      }
    });
  }

  loadAuthorDetails(authorId: number): void {
    this.authorService.getAuthorById(authorId).subscribe(author => {
      this.authorForm.patchValue({
        firstName: author.firstName,
        lastName: author.lastName
      });
    });
  }

  save(): void {
    if (this.authorForm.valid) {
      const authorData: Author = {
        firstName: this.authorForm.value.firstName,
        lastName: this.authorForm.value.lastName,
        id: 0
      };

      if (this.isEditMode && this.authorId) {
        authorData.id = this.authorId;
        this.authorService.updateAuthor(authorData).subscribe(() => {
          this.router.navigate(['/author']);
        }, (error: any) => {
          console.error('Error updating author', error);
        });
      } else {
        this.authorService.createAuthor(authorData).subscribe(() => {
          this.router.navigate(['/author']);
        }, (error: any) => {
          console.error('Error creating author', error);
        });
      }
    }
  }

  update(): void {
    if (this.authorForm.valid && this.authorId) {
      const authorData: Author = {
        id: this.authorId,
        firstName: this.authorForm.value.firstName,
        lastName: this.authorForm.value.lastName
      };

      this.authorService.updateAuthor(authorData).subscribe(() => {
        this.router.navigate(['/author']);
      }, (error: any) => {
        console.error('Error updating author', error);
      });
    }
  }
}
