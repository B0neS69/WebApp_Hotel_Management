package com.luxhost.hotel.controller;

import com.luxhost.hotel.model.User;
import com.luxhost.hotel.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{email}")
    public Optional<User> getUserByEmail(@PathVariable String email) {
        return userService.findUserByEmail(email);
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

    @PutMapping("/update-profile")
    public ResponseEntity<String> updateUserProfile(@RequestBody Map<String, String> updateData) {
        String email = updateData.get("email");
        String firstName = updateData.get("firstName");
        String lastName = updateData.get("lastName");
        String phone = updateData.get("phone");

        userService.updateUserProfile(email, firstName, lastName, phone);
        return ResponseEntity.ok("Профіль оновлено!");
    }

    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody Map<String, String> data) {
        String email = data.get("email");
        String oldPassword = data.get("oldPassword");
        String newPassword = data.get("newPassword");

        boolean updated = userService.changePassword(email, oldPassword, newPassword);
        if (updated) {
            return ResponseEntity.ok("Пароль змінено!");
        } else {
            return ResponseEntity.badRequest().body("Старий пароль невірний.");
        }
    }

}
