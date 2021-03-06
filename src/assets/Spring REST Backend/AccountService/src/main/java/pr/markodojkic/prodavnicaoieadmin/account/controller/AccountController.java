package pr.markodojkic.prodavnicaoieadmin.account.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pr.markodojkic.prodavnicaoieadmin.account.entity.Account;
import pr.markodojkic.prodavnicaoieadmin.account.service.AccountService;

import java.util.List;

@RestController()
@RequestMapping("api/prodavnicaoieadmin/account")
public class AccountController {
    @Autowired
    private AccountService accountService;

    @PostMapping("insert")
    @CrossOrigin(origins = {"http://localhost:51680", "https://localhost:51680"})
    public Account addNewAccount(@RequestBody Account newAccount) {
        return this.accountService.addNewAccount(newAccount);
    }

    @RequestMapping(value ="update/{id}", method = RequestMethod.PATCH)
    @CrossOrigin(origins = {"http://localhost:51680", "https://localhost:51680"})
    public Account updateAccount(@PathVariable int id, @RequestBody Account account) {
        return this.accountService.updateAccountById(id, account);
    }

    @RequestMapping(value = "delete/{id}", method = RequestMethod.DELETE)
    @CrossOrigin(origins = {"http://localhost:51680", "https://localhost:51680"})
    public void deleteAccount(@PathVariable int id) {
        this.accountService.deleteAccountById(id);
    }

    @RequestMapping(value = "find/{id}", method = RequestMethod.GET)
    @CrossOrigin(origins = {"http://localhost:51680", "https://localhost:51680"})
    public Account findAccount(@PathVariable int id) {
        return this.accountService.findAccountById(id);
    }

    @GetMapping("getTotalNumber")
    @CrossOrigin(origins = {"http://localhost:51680", "https://localhost:51680"})
    public long getTotalNumberOfRegisteredAccounts() {
        return this.accountService.getTotalNumberOfRegisteredAccounts();
    }

    @GetMapping("listAll")
    @CrossOrigin(origins = {"http://localhost:51680", "https://localhost:51680"})
    public List<Account> listAllAccounts() {
        return this.accountService.listAllAccounts();
    }
}
