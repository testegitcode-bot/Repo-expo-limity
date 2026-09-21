package com.limity.back.auth;

public class DuplicateEmailException extends RuntimeException {

    public DuplicateEmailException() {
        super("Já existe uma conta com este e-mail.");
    }
}