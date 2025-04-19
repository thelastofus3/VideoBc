package com.thelastofus.security.jwt;

import com.thelastofus.dto.jwt.JwtRequest;
import com.thelastofus.dto.jwt.JwtResponse;
import com.thelastofus.exception.InvalidPasswordException;
import com.thelastofus.model.User;
import com.thelastofus.security.config.PasswordEncoder;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@ApplicationScoped
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationManager {

    PasswordEncoder passwordEncoder;
    TokenProvider tokenProvider;

    public JwtResponse authenticate(User user, JwtRequest request) {
        if (passwordEncoder.verify(request.getPassword(), user.getPassword())) {
            return tokenProvider.generateToken(user);
        } else {
            throw new InvalidPasswordException("Password does not match");
        }
    }

    @Transactional
    public JwtResponse authenticate(User user) {
        return tokenProvider.generateToken(user);
    }

}
