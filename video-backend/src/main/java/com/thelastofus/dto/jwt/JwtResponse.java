package com.thelastofus.dto.jwt;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Getter
@Setter
@Builder
@Schema(description = "Jwt Response")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JwtResponse {

    @Schema(name = "id", example = "1")
    Long id;
    @Schema(name = "email", example = "user@gmail.com")
    String email;
    @Schema(name = "access token", example = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyMiIsImlkIjoxLCJyb2xlIjoiUk9MRV9VU0VSIiwiZXhwIjoxNzE4OTgzMjEwfQ.qhMFtY7icj-90HMC6wHVHuo9z0OXR54H_UZiXRs5aCuyciTL1dAuD0eFPnRKn_SfvtdmS5ZLRlDaMYdMBE4V8g")
    String accessToken;

}
