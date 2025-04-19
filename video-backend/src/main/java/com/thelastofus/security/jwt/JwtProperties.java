package com.thelastofus.security.jwt;

import io.smallrye.config.ConfigMapping;
import io.smallrye.config.WithDefault;
import jakarta.enterprise.context.Dependent;

@Dependent
@ConfigMapping(prefix = "com.thelastofus.quarkusjwt.jwt")
public interface JwtProperties {

    @WithDefault("http://localhost:8080")
    String issuer();

    Long access();

    @WithDefault("/privateKey.pem")
    String secret();

}
