package com.limity.back.auth;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, unique = true, length = 320)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column(length = 500)
    private String travelPreferences;

    @Column(precision = 12, scale = 2)
    private BigDecimal spentAmount = BigDecimal.ZERO;

    @Column(length = 64)
    private String passwordResetTokenHash;

    private Instant passwordResetExpiresAt;

    protected User() {
    }

    public User(String name, String email, String passwordHash) {
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.spentAmount = BigDecimal.ZERO;
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public void updateProfile(String name, String email) {
        this.name = name;
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public BigDecimal getSpentAmount() {
        return spentAmount == null ? BigDecimal.ZERO : spentAmount;
    }

    public List<String> getPreferenceLabels() {
        if (travelPreferences == null || travelPreferences.isBlank()) {
            return List.of();
        }
        return Arrays.stream(travelPreferences.split(","))
                .map(String::trim)
                .filter(label -> !label.isEmpty())
                .toList();
    }

    public void setPreferenceLabels(List<String> labels) {
        this.travelPreferences = labels == null || labels.isEmpty()
                ? null
                : String.join(",", labels);
    }

    public Instant getPasswordResetExpiresAt() {
        return passwordResetExpiresAt;
    }

    public void assignResetToken(String tokenHash, Instant expiresAt) {
        this.passwordResetTokenHash = tokenHash;
        this.passwordResetExpiresAt = expiresAt;
    }

    public void updatePassword(String newPasswordHash) {
        this.passwordHash = newPasswordHash;
        this.passwordResetTokenHash = null;
        this.passwordResetExpiresAt = null;
    }
}
