package com.thelastofus.mapper;

import com.thelastofus.dto.user.UserResponse;
import com.thelastofus.model.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "cdi")
public interface UserMapper {

    UserResponse convertToUserResponse(User user);

}
