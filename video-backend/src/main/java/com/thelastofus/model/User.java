package com.thelastofus.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.io.Serializable;

@Entity
@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user")
@Schema(description = "User")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User implements Serializable {

    @Schema(name = "id", example = "1")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    @Schema(name = "username", example = "thelastofus")
    @Column(nullable = false, unique = true, length = 120)
    String username;
    @Schema(name = "email", example = "user@gmail.com")
    @Column(nullable = false, unique = true)
    String email;
    @Schema(name = "password", example = "password")
    @Column(nullable = false, length = 120)
    String password;
    @Schema(name = "role", example = "ROLE_USER")
    @Column(nullable = false)
    @Enumerated(value = EnumType.STRING)
    Role role;

}
