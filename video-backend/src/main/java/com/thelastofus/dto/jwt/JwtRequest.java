package com.thelastofus.dto.jwt;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "User Login Request")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JwtRequest {

    @Schema(name = "email", example = "user@gmail.com")
    @NotBlank(message = "Email should not be empty")
    String email;
    @Schema(name = "password", example = "password")
    @NotBlank(message = "Password should not be empty")
    String password;

}
