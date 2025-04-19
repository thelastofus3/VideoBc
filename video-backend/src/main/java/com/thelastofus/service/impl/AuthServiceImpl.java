package com.thelastofus.service.impl;

import com.thelastofus.dto.jwt.JwtRequest;
import com.thelastofus.dto.jwt.JwtResponse;
import com.thelastofus.dto.user.UserRequest;
import com.thelastofus.model.User;
import com.thelastofus.security.jwt.AuthenticationManager;
import com.thelastofus.service.AuthService;
import com.thelastofus.service.UserService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@ApplicationScoped
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthServiceImpl implements AuthService {

    UserService userService;
    AuthenticationManager authenticationManager;

    @Override
    public JwtResponse login(JwtRequest loginRequest) {
        User user = userService.getByEmail(loginRequest.getEmail());
        return authenticationManager.authenticate(user, loginRequest);
    }

    @Override
    @Transactional
    public JwtResponse create(UserRequest userRequest) {
        User user = userService.saveUser(userRequest);
        return authenticationManager.authenticate(user);
    }
}
