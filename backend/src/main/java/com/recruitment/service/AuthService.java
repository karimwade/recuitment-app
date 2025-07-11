package com.recruitment.service;

import com.recruitment.dto.AuthResponse;
import com.recruitment.dto.LoginRequest;
import com.recruitment.dto.RegisterRequest;
import com.recruitment.entity.User;
import com.recruitment.repository.UserRepository;
import com.recruitment.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, 
                      JwtUtil jwtUtil, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.emailService = emailService;
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElse(null);
        
        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        
        return new AuthResponse(token, user.getEmail(), user.getRole().name(), 
                              user.getFirstName(), user.getLastName());
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = new User(
            request.getEmail(),
            passwordEncoder.encode(request.getPassword()),
            request.getFirstName(),
            request.getLastName(),
            User.Role.CANDIDATE
        );
        
        user = userRepository.save(user);
        
        emailService.sendWelcomeEmail(user.getEmail(), user.getFirstName());
        
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        
        return new AuthResponse(token, user.getEmail(), user.getRole().name(), 
                              user.getFirstName(), user.getLastName());
    }
}