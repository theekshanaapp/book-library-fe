import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', loadComponent: ()=> import('./pages/home/home.component')},
    { path: 'author', loadComponent: ()=> import('./pages/author/author.component')},
    { path: 'add-author', loadComponent: ()=> import('./components/add-author/add-author.component')},
    { path: 'update-author/:id', loadComponent: ()=> import('./components/add-author/add-author.component')},
    { path: 'book', loadComponent: ()=> import('./pages/books/books.component')},
    { path: 'add-book', loadComponent: ()=> import('./components/add-book/add-book.component')},
    { path: 'update-book/:id', loadComponent: ()=> import('./components/add-book/add-book.component')},
];