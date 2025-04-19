package com.thelastofus.resource;

import com.thelastofus.service.UserService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import org.jboss.resteasy.reactive.RestResponse;

@ApplicationScoped
@Path("/api/v1/user")
@RequiredArgsConstructor
@RolesAllowed("ROLE_USER")
@Tag(name = "User Resource")
@Produces(MediaType.APPLICATION_JSON)
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserResource {

    UserService userService;
    JsonWebToken jsonWebToken;

    @GET
    @Operation(summary = "Get user")
    public RestResponse<?> getUser() {
        return RestResponse.ok(userService.getByUsername(
                jsonWebToken.getName())
        );
    }

}
