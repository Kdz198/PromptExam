package hoangtugio.org.promptexam.Controller;

import hoangtugio.org.promptexam.Model.Account;
import hoangtugio.org.promptexam.Repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/account")
public class AccountController {

    @Autowired
    AccountRepository accountRepository;

    @PostMapping
    public Account createAccount ( Account account)
    {
        return accountRepository.save( account);
    }
}
