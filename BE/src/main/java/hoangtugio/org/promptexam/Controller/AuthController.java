package hoangtugio.org.promptexam.Controller;

import hoangtugio.org.promptexam.Model.Account;
import hoangtugio.org.promptexam.Repository.AccountRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AccountRepository accountRepository;
    private final String jwtSecret;
    private final long jwtExpirationMs = 86400000; // 1 ngày

    public AuthController(AccountRepository accountRepository, @Value("${jwt.secret}") String jwtSecret) {
        this.accountRepository = accountRepository;
        this.jwtSecret = jwtSecret;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestParam String email, @RequestParam String password) {
        Account dbUser = accountRepository.findById(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!password.equals(dbUser.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = Jwts.builder()
                .setSubject(dbUser.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();

        return ResponseEntity.ok(token);
    }
}
