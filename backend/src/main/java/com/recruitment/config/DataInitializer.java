package com.recruitment.config;

import com.recruitment.entity.User;
import com.recruitment.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("admin@recruitment.com")) {
            User superAdmin = new User(
                "admin@recruitment.com",
                passwordEncoder.encode("admin123"),
                "Super",
                "Admin",
                User.Role.SUPER_ADMIN
            );
            userRepository.save(superAdmin);
        }
    }
}