package com.thelastofus.security.config;


import io.quarkus.elytron.security.common.BcryptUtil;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class PasswordEncoder {

    public String encode(String password) {
        return BcryptUtil.bcryptHash(password);
    }

    public boolean verify(String password, String encodedPassword) {
        return BcryptUtil.matches(password, encodedPassword);
    }

}
