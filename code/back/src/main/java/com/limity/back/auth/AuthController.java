package com.limity.back.auth;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
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

    @PutMapping("/me")
    public UserView updateProfile(Authentication authentication, @Valid @RequestBody UpdateProfileRequest request) {
        return service.updateProfile(authentication.getName(), request);
    }

    @PutMapping("/me/preferences")
    public UserView updatePreferences(Authentication authentication, @Valid @RequestBody UpdatePreferencesRequest request) {
        return service.updatePreferences(authentication.getName(), request);
    }

    @DeleteMapping("/me")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAccount(Authentication authentication) {
        service.deleteAccount(authentication.getName());
    }
}
