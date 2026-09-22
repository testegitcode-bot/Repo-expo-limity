package com.limity.back.auth;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return service.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return service.login(request);
    }

    @GetMapping("/me")
    public UserView me(Authentication authentication) {
        return service.currentUser(authentication.getName());
    }

    @PutMapping("/preferences")
    public UserView updatePreferences(Authentication authentication,
            @Valid @RequestBody PreferenceRequest request) {
        return service.updatePreferences(authentication.getName(), request.preferences());
    }

    @PostMapping("/recover-password")
    public void recoverPassword(@Valid @RequestBody PasswordRecoveryRequest request) {
        service.recoverPassword(request.email(), request.newPassword());
    }
}
