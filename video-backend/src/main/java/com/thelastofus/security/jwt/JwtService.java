package com.thelastofus.security.jwt;

import java.security.PrivateKey;

public interface JwtService {
    PrivateKey readPrivateKey(String pemResName);
}
