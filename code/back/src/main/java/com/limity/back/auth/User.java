package com.limity.back.auth;

<<<<<<< HEAD
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;
=======
import java.util.LinkedHashSet;
import java.util.Set;
>>>>>>> a05be0119e7e45ee0e3321c2455c47ef0298f388
import java.util.UUID;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
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

<<<<<<< HEAD
    @Column(length = 500)
    private String travelPreferences;

    @Column(precision = 12, scale = 2)
    private BigDecimal spentAmount = BigDecimal.ZERO;

    @Column(length = 64)
    private String passwordResetTokenHash;

    private Instant passwordResetExpiresAt;
=======
    @Column(nullable = false)
    private int points = 0;

    @Column(nullable = false)
    private double cashback = 0.0;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_preferences", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "preference", length = 40)
    private Set<String> preferences = new LinkedHashSet<>();
>>>>>>> a05be0119e7e45ee0e3321c2455c47ef0298f388

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

<<<<<<< HEAD
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
=======
    public int getPoints() {
        return points;
    }

    public double getCashback() {
        return cashback;
    }

    public Set<String> getPreferences() {
        return preferences;
    }

    public void setPreferences(Set<String> preferences) {
        this.preferences = new LinkedHashSet<>(preferences);
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
>>>>>>> a05be0119e7e45ee0e3321c2455c47ef0298f388
    }
}
