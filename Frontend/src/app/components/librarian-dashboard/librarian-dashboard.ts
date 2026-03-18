import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-librarian-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './librarian-dashboard.html',
  styleUrls: ['./librarian-dashboard.css']
})
export default class LibrarianDashboard implements OnInit {

  books: any[] = [];
  filteredBooks: any[] = []; // 🔍 added
  searchTerm: string = '';   // 🔍 added
  message = '';

  newBook = {
    title: '',
    author: '',
    totalCopies: 1,
    availableCopies: 1
  };

  editingBook: any = null;
  librarianId = 0;

  selectedImage: File | null = null;

  private bookApi = 'http://localhost:8080/api/books';

  // ========================
  // 📄 PAGINATION
  // ========================
  currentPage = 1;
  pageSize = 5;

  get paginatedBooks() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredBooks.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.filteredBooks.length / this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.librarianId = user.id;
    }

    this.loadBooks();
  }

  trackByBookId(index: number, book: any): number {
    return book.id;
  }

  loadBooks() {
    this.http.get<any[]>(this.bookApi).subscribe({
      next: (data) => {
        this.books = data;
        this.filteredBooks = [...data]; // 🔍 important
        this.currentPage = 1;
      },
      error: () => this.message = '❌ Failed to load books'
    });
  }

  // ========================
  // 🔍 SEARCH (ADDED)
  // ========================
  searchBooks() {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      this.filteredBooks = [...this.books];
    } else {
      this.filteredBooks = this.books.filter(book =>
        book.title?.toLowerCase().includes(term) ||
        book.author?.toLowerCase().includes(term)
      );
    }

    this.currentPage = 1;
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedImage = input.files && input.files.length > 0 ? input.files[0] : null;
  }

  addBook() {
    if (this.selectedImage) {
      const formData = new FormData();
      formData.append('title', this.newBook.title);
      formData.append('author', this.newBook.author);
      formData.append('totalCopies', this.newBook.totalCopies.toString());
      formData.append('availableCopies', this.newBook.availableCopies.toString());
      formData.append('image', this.selectedImage);

      this.http.post(`${this.bookApi}/upload`, formData).subscribe({
        next: () => {
          this.message = '✅ Book with image added successfully!';
          this.resetForm();
          this.loadBooks();
        },
        error: () => this.message = '❌ Failed to add book with image'
      });
      return;
    }

    this.http.post(this.bookApi, this.newBook).subscribe({
      next: () => {
        this.message = '✅ Book added successfully!';
        this.resetForm();
        this.loadBooks();
      },
      error: () => this.message = '❌ Failed to add book'
    });
  }

  resetForm() {
    this.newBook = { title: '', author: '', totalCopies: 1, availableCopies: 1 };
    this.selectedImage = null;

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  editBook(book: any) {
    this.editingBook = { ...book };
  }

  cancelEdit() {
    this.editingBook = null;
  }

  updateBook() {
    this.http.put(`${this.bookApi}/${this.editingBook.id}`, this.editingBook).subscribe({
      next: () => {
        this.message = '✅ Book updated successfully!';
        this.editingBook = null;
        this.loadBooks();
      },
      error: () => this.message = '❌ Failed to update book'
    });
  }

  deleteBook(id: number) {
    this.http.delete(`${this.bookApi}/${id}`).subscribe({
      next: () => {
        this.message = '✅ Book deleted!';
        this.loadBooks();
      },
      error: () => this.message = '❌ Failed to delete book'
    });
  }
}
