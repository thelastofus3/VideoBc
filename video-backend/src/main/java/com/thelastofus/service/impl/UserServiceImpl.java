package com.thelastofus.service.impl;

import com.thelastofus.dto.user.UserRequest;
import com.thelastofus.dto.user.UserResponse;
import com.thelastofus.exception.EmailAlreadyExistsException;
import com.thelastofus.exception.PasswordMatchesException;
import com.thelastofus.exception.ResourceNotFoundException;
import com.thelastofus.exception.UsernameAlreadyExistsException;
import com.thelastofus.mapper.UserMapper;
import com.thelastofus.model.UserRole;
import com.thelastofus.model.User;
import com.thelastofus.repository.UserRepository;
import com.thelastofus.security.config.PasswordEncoder;
import com.thelastofus.service.UserService;
import io.quarkus.cache.CacheKey;
import io.quarkus.cache.CacheResult;
import jakarta.enterprise.context.ApplicationScoped;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@ApplicationScoped
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserServiceImpl implements UserService {

    UserRepository userRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;

    @Override
    @CacheResult(cacheName = "userService::getById")
    public UserResponse getById(@CacheKey Long id) {
        User user = userRepository.findById(id);
        return userMapper.convertToUserResponse(user);
    }

    @Override
    @CacheResult(cacheName = "userService::getByUsername")
    public UserResponse getByUsername(@CacheKey String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    @Override
    @CacheResult(cacheName = "userService::getByEmail")
    public User getByEmail(@CacheKey String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    }

    @Override
    public User saveUser(UserRequest userRequest) {
        validateUserRequest(userRequest);

        return userRepository.save(User.builder()
                .username(userRequest.getUsername())
                .email(userRequest.getEmail())
                .password(passwordEncoder.encode(userRequest.getPassword()))
                .role(UserRole.ROLE_USER)
                .build());
    }

    private void validateUserRequest(UserRequest userRequest) {
        if (userRepository.findByEmail(userRequest.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("This email is already taken");
        }
        if (userRepository.findByUsername(userRequest.getUsername()).isPresent()) {
            throw new UsernameAlreadyExistsException("This username is already taken");
        }
        if (!userRequest.getPassword().equals(userRequest.getMatchingPassword())) {
            throw new PasswordMatchesException("Password do not match");
        }
    }

}
