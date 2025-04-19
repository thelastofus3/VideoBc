package com.thelastofus.service;

import com.thelastofus.dto.jwt.JwtRequest;
import com.thelastofus.dto.jwt.JwtResponse;
import com.thelastofus.dto.user.UserRequest;

public interface AuthService {
    JwtResponse login(JwtRequest loginRequest);

    JwtResponse create(UserRequest userRequest);
}
