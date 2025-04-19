package com.thelastofus.dto.user;

import com.thelastofus.model.Role;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.io.Serializable;

@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "User Response")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse implements Serializable {

    @Schema(name = "id", example = "1")
    Long id;
    @Schema(name = "email", example = "user@gmail.com")
    String email;
    @Schema(name = "role", example = "ROLE_USER")
    Role role;

}
