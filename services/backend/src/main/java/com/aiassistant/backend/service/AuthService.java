package com.aiassistant.backend.service;

import com.aiassistant.backend.config.jwt.JwtTokenProvider;
import com.aiassistant.backend.dto.auth.AuthResponse;
import com.aiassistant.backend.dto.auth.LoginRequest;
import com.aiassistant.backend.dto.auth.SignupRequest;
import com.aiassistant.backend.model.User;
import com.aiassistant.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthResponse signup(SignupRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        User user = new User();
        user.setEmail(req.getEmail());
        user.setName(req.getName());
        user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        userRepository.save(user);
        String token = jwtTokenProvider.generateToken(user.getEmail(), Map.of("role", "USER"));
        return new AuthResponse(token, user.getEmail(), user.getName());
    }

    public AuthResponse login(LoginRequest req) {
        var user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }
        String token = jwtTokenProvider.generateToken(user.getEmail(), Map.of("role", "USER"));
        return new AuthResponse(token, user.getEmail(), user.getName());
    }
}
