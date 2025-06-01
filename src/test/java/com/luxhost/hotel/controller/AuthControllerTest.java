package com.luxhost.hotel.controller;

import com.luxhost.hotel.dto.AuthRequest;
import com.luxhost.hotel.dto.AuthResponse;
import com.luxhost.hotel.dto.RegisterRequest;
import com.luxhost.hotel.model.Role;
import com.luxhost.hotel.model.User;
import com.luxhost.hotel.service.UserService;
import com.luxhost.hotel.config.JwtUtil;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthControllerTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private UserService userService;

    @InjectMocks
    private AuthController authController;

    public AuthControllerTest() {
        org.mockito.MockitoAnnotations.openMocks(this);
    }
//    public RegisterRequest(String username, String email, String password, String firstName, String lastName, String phone) {
//        this.username = username;
//        this.phone = phone;
//        this.lastName = lastName;
//        this.firstName = firstName;
//        this.password = password;
//        this.email = email;
//    }
    @Test
    void testRegisterUser() {
        RegisterRequest request = new RegisterRequest("user", "user@email.com", "password", "John", "Doe", "123456");
        String result = authController.register(request);

        verify(userService, times(1)).registerUser(
                "user", "user@email.com", "password", "John", "Doe", "123456"
        );

        assertEquals("User registered successfully!", result);
    }

    @Test
    void testLogin() {
        AuthRequest request = new AuthRequest("user", "password");

        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);

        User mockUser = new User();
        mockUser.setUsername("user");
        mockUser.setEmail("user@email.com");
        mockUser.setRole(Role.USER);

        when(userService.findUserByUsername("user")).thenReturn(Optional.of(mockUser));
        when(jwtUtil.generateToken("user", "USER")).thenReturn("mocked-token");

        AuthResponse response = authController.login(request);

        assertEquals("mocked-token", response.getToken());
        assertEquals("user@email.com", response.getEmail());
        assertEquals("USER", response.getRole());
        assertEquals("user", response.getUsername());
    }

    @Test
    void testCheckUsernameAvailability() {
        when(userService.findUserByUsername("new_user")).thenReturn(Optional.empty());
        assertTrue(authController.checkUsernameAvailability("new_user"));
    }

    @Test
    void testCheckEmailAvailability() {
        when(userService.findUserByEmail("new@email.com")).thenReturn(Optional.empty());
        assertTrue(authController.checkEmailAvailability("new@email.com"));
    }
}
