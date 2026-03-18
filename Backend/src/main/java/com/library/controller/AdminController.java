package com.library.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.library.entity.User;
import com.library.service.UserService;


@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class AdminController {

    @Autowired
    private UserService userService;

  

    private static final String PERMANENT_ADMIN_EMAIL = "admin@gmail.com";

    // ✅ Get all users
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

 
    // ✅ Delete user (Permanent admin cannot be deleted)
    @DeleteMapping("/users/{id}")
    public String deleteUser(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user != null && PERMANENT_ADMIN_EMAIL.equalsIgnoreCase(user.getEmail())) {
            return "⛔ Cannot delete the permanent admin account!";
        }
        userService.deleteUser(id);
        return "🗑️ User deleted successfully (ID: " + id + ")";
    }

    // ✅ Update user role (Admin cannot be changed)
    @PutMapping("/users/{id}/role")
    public String updateUserRole(@PathVariable Long id, @RequestParam String newRole) {
        User user = userService.getUserById(id);
        if (user != null && PERMANENT_ADMIN_EMAIL.equalsIgnoreCase(user.getEmail())) {
            return "⛔ Cannot change role of the permanent admin!";
        }
        boolean updated = userService.updateUserRole(id, newRole);
        return updated ? "✅ Role updated successfully" : "❌ User not found";
    }

    
}
