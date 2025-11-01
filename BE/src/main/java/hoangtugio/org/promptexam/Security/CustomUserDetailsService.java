package hoangtugio.org.promptexam.Security;


import hoangtugio.org.promptexam.Model.Account;
import hoangtugio.org.promptexam.Repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private AccountRepository accountRepository; // repo bạn đang dùng để lấy user

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Account account = accountRepository.findById(email) // hoặc findByUsername()
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return new org.springframework.security.core.userdetails.User(
                account.getEmail(),
                account.getPassword(),
                List.of(new SimpleGrantedAuthority(String.valueOf("USER"))) // hoặc từ user.getRole()
        );
    }
}
