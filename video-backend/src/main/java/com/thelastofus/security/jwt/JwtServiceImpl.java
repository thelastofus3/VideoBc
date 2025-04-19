package com.thelastofus.security.jwt;

import com.thelastofus.exception.EncodeException;
import jakarta.enterprise.context.ApplicationScoped;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;

@ApplicationScoped
public class JwtServiceImpl implements JwtService {

    @Override
    public PrivateKey readPrivateKey(final String pemResName) {
        String pemContent = readResourceContent(pemResName);
        return decodePrivateKey(pemContent);
    }

    private String readResourceContent(String resourcePath) {
        try (InputStream contentIS = getClass().getResourceAsStream(resourcePath)) {
            if (contentIS == null) {
                throw new IOException("Could not find resource: " + resourcePath);
            }
            return new String(contentIS.readAllBytes(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new EncodeException("Error reading resource content from %s".formatted(resourcePath));
        }
    }

    private PrivateKey decodePrivateKey(String pemEncoded) {
        byte[] encodedBytes = toEncodedBytes(pemEncoded);
        return generatePrivateKeyFromBytes(encodedBytes);
    }

    private byte[] toEncodedBytes(String pemEncoded) {
        String normalizedPem = pemEncoded.replaceAll("\\s", "");
        try {
            return Base64.getDecoder().decode(normalizedPem);
        } catch (IllegalArgumentException e) {
            throw new EncodeException("Error decoding private key. Check the key format.");
        }
    }

    private PrivateKey generatePrivateKeyFromBytes(byte[] encodedBytes) {
        try {
            PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(encodedBytes);
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            return keyFactory.generatePrivate(keySpec);
        } catch (Exception e) {
            throw new EncodeException("Error generating private key from bytes");
        }
    }

}
