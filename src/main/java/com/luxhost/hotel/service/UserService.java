package com.luxhost.hotel.service;

import com.luxhost.hotel.model.User;
import com.luxhost.hotel.model.Role;
import com.luxhost.hotel.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void registerUser(String username, String email, String password, String firstName, String lastName, String phone) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new IllegalArgumentException("Користувач із таким іменем вже існує!");
        }
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Користувач із таким email вже існує!");
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email); // 🔹 Додаємо email
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(Role.USER);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPhone(phone);
        userRepository.save(user);
    }

    public void registerAdmin(String username, String email, String password) {
        User admin = new User();
        admin.setUsername(username);
        admin.setEmail(email);
        admin.setPassword(passwordEncoder.encode(password));
        admin.setRole(Role.ADMIN);
        userRepository.save(admin);
    }

    public Optional<User> findUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }


    public Optional<User> findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public void updateUserProfile(String email, String firstName, String lastName, String phone) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Користувача не знайдено"));
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPhone(phone);
        userRepository.save(user);
    }

    public boolean changePassword(String email, String oldPassword, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Користувача не знайдено"));

        if (passwordEncoder.matches(oldPassword, user.getPassword())) {
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            return true;
        }

        return false;
    }

}
