package com.thelastofus.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "User Register Request")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserRequest {

    @Schema(name = "username", example = "thelastofus")
    @NotBlank(message = "Username should not be empty")
    @Size(min = 4, max = 120, message = "Username should be between 4 and 120 characters")
    String username;
    @Schema(name = "email", example = "user@gmail.com")
    @Email
    @NotBlank(message = "Email should not be empty")
    String email;
    @Schema(name = "password", example = "password")
    @NotBlank(message = "Password should not be empty")
    @Size(min = 4, max = 120, message = "Password should be between 4 and 120 characters")
    String password;
    @Schema(name = "matchingPassword", example = "password")
    @NotBlank(message = "Matching password should not be empty")
    @Size(min = 4, max = 120, message = "Matching password should be between 4 and 120 characters")
    String matchingPassword;

}
