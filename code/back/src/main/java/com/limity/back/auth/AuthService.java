package com.limity.back.auth;

import java.util.Locale;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository users, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.email());
        if (users.existsByEmail(email)) {
            throw new DuplicateEmailException();
        }
        User user = users.save(new User(request.name().trim(), email, passwordEncoder.encode(request.password())));
        return response(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = users.findByEmail(normalizeEmail(request.email()))
                .filter(candidate -> passwordEncoder.matches(request.password(), candidate.getPasswordHash()))
                .orElseThrow(InvalidCredentialsException::new);
        return response(user);
    }

    @Transactional(readOnly = true)
    public UserView currentUser(String subject) {
        try {
            return users.findById(java.util.UUID.fromString(subject))
                    .map(UserView::from)
                    .orElseThrow(InvalidCredentialsException::new);
        } catch (IllegalArgumentException exception) {
            throw new InvalidCredentialsException();
        }
    }

    private AuthResponse response(User user) {
        JwtService.IssuedToken token = jwtService.issue(user);
        return new AuthResponse(token.value(), "Bearer", token.expiresAt(), UserView.from(user));
    }

    private static String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}