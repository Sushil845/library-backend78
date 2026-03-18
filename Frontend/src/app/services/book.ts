import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ✅ Define the Book structure
export interface Book {
  id?: number;
  title: string;
  author: string;
  totalCopies: number;
  availableCopies: number;
  
  imageUrl?: string; // ✅ NEW
}

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private baseUrl = 'http://localhost:8080/api/librarian/books';

  constructor(private http: HttpClient) {}

  // ✅ Get all books
  getAllBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.baseUrl);
  }

  // ✅ Add a new book
  addBook(book: Book): Observable<string> {
    return this.http.post(this.baseUrl, book, { responseType: 'text' });
  }

  // ✅ Update a book
  updateBook(id: number, book: Book): Observable<string> {
    return this.http.put(`${this.baseUrl}/${id}`, book, { responseType: 'text' });
  }

  // ✅ Delete a book
  deleteBook(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }
}
