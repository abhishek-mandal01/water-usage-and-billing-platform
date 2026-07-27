package com.abhishekmandal.water_usage_backend.service;

import com.abhishekmandal.water_usage_backend.entity.AppUser;
import com.abhishekmandal.water_usage_backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    @Test
    void testLogin_Success() {
        String email = "test@example.com";
        String password = "password123";
        String encodedPassword = "encodedPassword123";

        AppUser mockUser = new AppUser();
        mockUser.setId(1L);
        mockUser.setEmail(email);
        mockUser.setPassword(encodedPassword);
        mockUser.setRole("RESIDENT");

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches(password, encodedPassword)).thenReturn(true);

        AppUser loggedInUser = authService.login(email, password);

        assertNotNull(loggedInUser);
        assertEquals("RESIDENT", loggedInUser.getRole());
        verify(userRepository, times(1)).findByEmail(email);
        verify(passwordEncoder, times(1)).matches(password, encodedPassword);
    }

    @Test
    void testLogin_InvalidPassword() {
        String email = "test@example.com";
        String password = "wrongPassword";
        String encodedPassword = "encodedPassword123";

        AppUser mockUser = new AppUser();
        mockUser.setEmail(email);
        mockUser.setPassword(encodedPassword);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches(password, encodedPassword)).thenReturn(false);

        AppUser loggedInUser = authService.login(email, password);

        assertNull(loggedInUser);
        verify(userRepository, times(1)).findByEmail(email);
    }
}
