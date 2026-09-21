package com.limity.back.auth;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Optional;

import javax.crypto.SecretKey;

import com.limity.back.config.LimityProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private final SecretKey key;
    private final LimityProperties.Auth properties;

    public JwtService(LimityProperties properties) {
        this.properties = properties.auth();
        this.key = Keys.hmacShaKeyFor(this.properties.jwtSecret().getBytes(StandardCharsets.UTF_8));
    }

    public IssuedToken issue(User user) {
        Instant expiresAt = Instant.now().plus(properties.jwtExpiration());
        String token = Jwts.builder()
                .subject(user.getId().toString())
                .claim("email", user.getEmail())
                .issuedAt(new Date())
                .expiration(Date.from(expiresAt))
                .signWith(key)
                .compact();
        return new IssuedToken(token, expiresAt);
    }

    public Optional<String> subject(String token) {
        try {
            Claims claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
            return Optional.ofNullable(claims.getSubject());
        } catch (JwtException | IllegalArgumentException exception) {
            return Optional.empty();
        }
    }

    public record IssuedToken(String value, Instant expiresAt) {
    }
}