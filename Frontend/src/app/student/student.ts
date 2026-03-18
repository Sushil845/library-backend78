import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './student.html',
  styleUrls: ['./student.css']
})
export default class Student implements OnInit {

  books: any[] = [];
  filteredBooks: any[] = [];
  searchTerm: string = '';
  userEmail: string = '';
  loading: boolean = false;
  requestedBooks: Set<number> = new Set();

  // ========================
  // 📄 PAGINATION (ADDED ONLY)
  // ========================
  currentPage = 1;
  pageSize = 3;

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
  // ========================
  // 📄 PAGINATION END
  // ========================

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        this.userEmail = userObj.email || '';
      } catch (e) {
        console.error('Failed to parse user from sessionStorage', e);
      }
    }

    if (!this.userEmail) {
      alert('No logged-in user found. Please log in again.');
      return;
    }

    this.loadBooks();
  }

  loadBooks(): void {
    this.loading = true;
    this.http.get<any[]>('http://localhost:8080/api/books').subscribe({
      next: (data: any) => {
        this.books = Array.isArray(data) ? data : [];
        this.filteredBooks = [...this.books];
        this.currentPage = 1; // reset page
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Error loading books:', err);
        alert('Failed to load books. Please try again.');
      }
    });
  }

  searchBooks(): void {
    const term = this.searchTerm.trim().toLowerCase();

    if (term === '') {
      this.filteredBooks = [...this.books];
      this.currentPage = 1;
      return;
    }

    this.filteredBooks = this.books.filter((book: any) => {
      const titleMatch = book.title && book.title.toLowerCase().includes(term);
      const authorMatch = book.author && book.author.toLowerCase().includes(term);
      return titleMatch || authorMatch;
    });

    this.currentPage = 1;
  }

  showAllBooks(): void {
    this.searchTerm = '';
    this.filteredBooks = [...this.books];
    this.currentPage = 1;
  }

  requestBorrow(bookId: number): void {
    if (!this.userEmail) {
      alert('User email not found in session.');
      return;
    }

    if (this.requestedBooks.has(bookId)) {
      alert('You already sent a borrow request for this book.');
      return;
    }

    const borrowRequest = { userEmail: this.userEmail, bookId: bookId };
    this.requestedBooks.add(bookId);

    this.http.post('http://localhost:8080/api/borrow/request', borrowRequest).subscribe({
      next: (response: any) => {
        alert(response?.message || '✅ Borrow request sent successfully!');
      },
      error: (err: any) => {
        console.error('Error sending borrow request:', err);
        this.requestedBooks.delete(bookId);

        if (
          err.error?.message?.includes('active borrowed') ||
          err.error?.message?.includes('pending')
        ) {
          alert(
            '⚠️ You already have an active or pending borrow. Please return that book first.'
          );
        } else if (err.status === 400) {
          alert('❌ Invalid request: Please check your details and try again.');
        } else if (err.status === 0) {
          alert(
            '❌ Connection error: Please ensure the backend is running on port 8080.'
          );
        } else {
          alert(
            err.error?.message || '❌ Failed to send borrow request. Try again later.'
          );
        }
      }
    });
  }
}
