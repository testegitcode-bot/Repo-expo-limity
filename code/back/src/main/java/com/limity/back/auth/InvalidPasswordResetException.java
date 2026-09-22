package com.limity.back.auth;

public class InvalidPasswordResetException extends RuntimeException {

    public InvalidPasswordResetException() {
        super("Este link de recuperação é inválido ou já expirou.");
    }
}
