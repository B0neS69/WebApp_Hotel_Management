package com.luxhost.hotel.controller;

import com.luxhost.hotel.dto.AuthRequest;
import com.luxhost.hotel.dto.AuthResponse;
import com.luxhost.hotel.dto.RegisterRequest;
import com.luxhost.hotel.model.User;
import com.luxhost.hotel.service.UserService;
import com.luxhost.hotel.config.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserService userService;

    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        userService.registerUser(
                request.getUsername(),
                request.getEmail(),
                request.getPassword(),
                request.getFirstName(),
                request.getLastName(),
                request.getPhone()
        );
        return "User registered successfully!";
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = userService.findUserByUsername(request.getUsername()).orElseThrow();
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());

        return new AuthResponse(token, user.getEmail(), user.getRole().name(), user.getUsername());
    }

    @GetMapping("/check-username")
    public boolean checkUsernameAvailability(@RequestParam String username) {
        return userService.findUserByUsername(username).isEmpty();
    }

    @GetMapping("/check-email")
    public boolean checkEmailAvailability(@RequestParam String email) {
        return userService.findUserByEmail(email).isEmpty();
    }

}
