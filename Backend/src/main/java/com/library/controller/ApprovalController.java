package com.library.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.library.entity.BorrowRecord;
import com.library.entity.User;
import com.library.service.BorrowService;
import com.library.service.UserService;

@RestController
@RequestMapping("/api/approval")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class ApprovalController {

    @Autowired
    private BorrowService borrowService;

    @Autowired
    private UserService userService;

    // ✅ 1. Get all borrow records (Pending, Borrowed, Overdue, etc.)
    @GetMapping("/records")
    public List<BorrowRecord> getAllBorrowRecords() {
        return borrowService.getAllBorrowRecords();
    }

    // ✅ 2. Approve borrow request with due date
    @PutMapping("/approve/{recordId}/{librarianId}")
    public String approveBorrow(@PathVariable Long recordId, @PathVariable Long librarianId) {
        User librarian = userService.getUserById(librarianId);
        if (librarian == null || !"LIBRARIAN".equalsIgnoreCase(librarian.getRole())) {
            return "❌ Invalid librarian ID";
        }

        try {
            BorrowRecord record = borrowService.approveBorrow(recordId, librarian);
            return "✅ Borrow request approved for: " + record.getBook().getTitle();
        } catch (Exception e) {
            return "❌ " + e.getMessage();
        }
    }

    // ✅ 3. Reject borrow request (sends rejection mail)
    @PutMapping("/reject/{recordId}/{librarianId}")
    public String rejectBorrow(@PathVariable Long recordId, @PathVariable Long librarianId) {
        User librarian = userService.getUserById(librarianId);
        if (librarian == null || !"LIBRARIAN".equalsIgnoreCase(librarian.getRole())) {
            return "❌ Invalid librarian ID";
        }

        try {
            BorrowRecord record = borrowService.rejectBorrow(recordId, librarian);
            return "❌ Borrow request rejected for: " + record.getBook().getTitle();
        } catch (Exception e) {
            return "❌ " + e.getMessage();
        }
    }

    // ✅ 4. Send manual reminder mail
    @PostMapping("/reminder/{recordId}")
    public String sendManualReminder(@PathVariable Long recordId, @RequestParam boolean overdue) {
        try {
            borrowService.sendManualReminder(recordId, overdue);
            return "📧 Reminder mail sent successfully.";
        } catch (Exception e) {
            return "❌ " + e.getMessage();
        }
    }
}
