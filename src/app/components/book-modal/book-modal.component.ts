import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  author: string;
  isbn: string
}

@Component({
  selector: 'app-book-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-modal.component.html',
  styleUrl: './book-modal.component.scss'
})
export class BookModalComponent {
  @Input() product: any;
  @Output() closeModal = new EventEmitter<void>();

  constructor() { }

  onClose() {
    this.closeModal.emit();
  }

}
