package com.thelastofus.service;

import com.thelastofus.dto.user.UserRequest;
import com.thelastofus.dto.user.UserResponse;
import com.thelastofus.model.User;

public interface UserService {

    UserResponse getById(Long id);

    UserResponse getByUsername(String username);

    User getByEmail(String email);

    User saveUser(UserRequest userRequest);

}
