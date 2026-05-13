package at.mci.sw2.bug_tracking_api.auth;

import at.mci.sw2.bug_tracking_api.user.User;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class JwtService {

    private static final String HMAC_SHA256 = "HmacSHA256";
    private static final Base64.Encoder BASE64_URL_ENCODER = Base64.getUrlEncoder().withoutPadding();
    private static final Base64.Decoder BASE64_URL_DECODER = Base64.getUrlDecoder();

    private final ObjectMapper objectMapper;
    private final byte[] secret;
    private final long expirationSeconds;

    public JwtService(
            @Value("${security.jwt.secret}") String secret,
            @Value("${security.jwt.expiration-minutes}") long expirationMinutes) {
        this.objectMapper = new ObjectMapper();
        this.secret = secret.getBytes(StandardCharsets.UTF_8);
        this.expirationSeconds = expirationMinutes * 60;
    }

    public String generateToken(User user) {
        try {
            Map<String, Object> header = Map.of(
                    "alg", "HS256",
                    "typ", "JWT");

            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("sub", user.getUsername());
            payload.put("userId", user.getUserId());
            payload.put("role", user.getRole() != null ? user.getRole().getRoleName() : null);
            payload.put("exp", Instant.now().getEpochSecond() + expirationSeconds);

            String encodedHeader = encodeJson(header);
            String encodedPayload = encodeJson(payload);
            String unsignedToken = encodedHeader + "." + encodedPayload;

            return unsignedToken + "." + sign(unsignedToken);
        } catch (Exception exception) {
            throw new IllegalStateException("Could not create JWT", exception);
        }
    }

    public boolean isValid(String token, User user) {
        String username = extractUsername(token);
        return username != null && username.equals(user.getUsername()) && !isExpired(token);
    }

    public String extractUsername(String token) {
        Object subject = extractPayload(token).get("sub");
        return subject instanceof String username ? username : null;
    }

    private boolean isExpired(String token) {
        Object exp = extractPayload(token).get("exp");
        if (!(exp instanceof Number expiration)) {
            return true;
        }

        return Instant.now().getEpochSecond() >= expiration.longValue();
    }

    private Map<String, Object> extractPayload(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3 || !signatureMatches(parts)) {
                return Map.of();
            }

            String json = new String(BASE64_URL_DECODER.decode(parts[1]), StandardCharsets.UTF_8);
            return objectMapper.readValue(json, new TypeReference<>() {
            });
        } catch (Exception exception) {
            return Map.of();
        }
    }

    private boolean signatureMatches(String[] parts) throws Exception {
        String expectedSignature = sign(parts[0] + "." + parts[1]);
        return MessageDigest.isEqual(
                expectedSignature.getBytes(StandardCharsets.UTF_8),
                parts[2].getBytes(StandardCharsets.UTF_8));
    }

    private String encodeJson(Map<String, Object> value) throws Exception {
        return BASE64_URL_ENCODER.encodeToString(objectMapper.writeValueAsBytes(value));
    }

    private String sign(String value) throws Exception {
        Mac mac = Mac.getInstance(HMAC_SHA256);
        mac.init(new SecretKeySpec(secret, HMAC_SHA256));
        return BASE64_URL_ENCODER.encodeToString(mac.doFinal(value.getBytes(StandardCharsets.UTF_8)));
    }
}
