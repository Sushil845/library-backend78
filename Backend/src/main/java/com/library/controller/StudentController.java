package com.library.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.library.entity.Book;
import com.library.entity.BorrowRecord;
import com.library.entity.User;
import com.library.service.BookService;
import com.library.service.BorrowService;
import com.library.service.UserService;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class StudentController {

    @Autowired
    private BookService bookService;

    @Autowired
    private BorrowService borrowService;

    @Autowired
    private UserService userService;

    // ✅ 1. View all available books
    @GetMapping("/books")
    public List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }

    // ✅ 2. Borrow a book
    @PostMapping("/borrow/{userId}/{bookId}")
    public String borrowBook(@PathVariable Long userId, @PathVariable Long bookId) {
        User user = userService.getUserById(userId);
        Book book = bookService.getBookById(bookId);

        if (user == null || book == null) {
            return "❌ Invalid user or book ID";
        }

        if (book.getAvailableCopies() <= 0) {
            return "❌ Book not available for borrowing";
        }

        borrowService.requestBorrow(user, book);
        return "✅ " + book.getTitle() + " borrowed successfully!";
    }

    // ✅ 3. Return a borrowed book
    @PostMapping("/return/{recordId}")
    public String returnBook(@PathVariable Long recordId) {
        BorrowRecord record = borrowService.returnBook(recordId);
        if (record != null) {
            return "📘 " + record.getBook().getTitle() + " returned successfully!";
        } else {
            return "❌ Invalid record or already returned";
        }
    }

    // ✅ 4. View student’s borrowed books
    @GetMapping("/borrowed/{userId}")
    public List<BorrowRecord> getBorrowedBooks(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        return borrowService.getBorrowedBooks(user);
    }
}
