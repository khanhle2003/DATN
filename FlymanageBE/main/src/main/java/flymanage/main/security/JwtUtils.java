package flymanage.main.security;


import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import io.jsonwebtoken.JwtException;
import java.util.HashSet;

@Component
public class JwtUtils {
    private static final String SECRET_KEY = "lebaokhanhyeukieudieumilebaokhanhyeukieudieumilebaokhanhyeukieudieumi";
    private static final long EXPIRATION_TIME = 86400000; 

    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    
    private final ConcurrentHashMap<String, Boolean> blacklistedTokens = new ConcurrentHashMap<>();

    public String generateJwtToken(Authentication authentication) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();
        
        return Jwts.builder()
                .setSubject(userPrincipal.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validateToken(String token) {
        try {
            if (isTokenBlacklisted(token)) {
                return false;
            }
            
            Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);
                
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    public void invalidateToken(String token) {
        blacklistedTokens.put(token, true);
        
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            
            Date expiration = claims.getExpiration();
            
            new Thread(() -> {
                try {
                    Thread.sleep(expiration.getTime() - System.currentTimeMillis());
                    blacklistedTokens.remove(token);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }).start();
            
        } catch (JwtException e) {
            new Thread(() -> {
                try {
                    Thread.sleep(EXPIRATION_TIME);
                    blacklistedTokens.remove(token);
                } catch (InterruptedException ex) {
                    Thread.currentThread().interrupt();
                }
            }).start();
        }
    }

    private boolean isTokenBlacklisted(String token) {
        return blacklistedTokens.containsKey(token);
    }

    public int getBlacklistSize() {
        return blacklistedTokens.size();
    }

    public void clearExpiredTokens() {
        Set<String> tokensToRemove = new HashSet<>();

        for (String token : blacklistedTokens.keySet()) {
            try {
                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(key)
                        .build()
                        .parseClaimsJws(token)
                        .getBody();
                if (claims.getExpiration().before(new Date())) {
                    tokensToRemove.add(token);
                }
            } catch (JwtException e) {
                tokensToRemove.add(token);
            }
        }

        for (String token : tokensToRemove) {
            blacklistedTokens.remove(token);
        }
    }
}