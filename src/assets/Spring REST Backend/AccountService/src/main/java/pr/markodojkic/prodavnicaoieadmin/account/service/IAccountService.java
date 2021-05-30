package pr.markodojkic.prodavnicaoieadmin.account.service;

import pr.markodojkic.prodavnicaoieadmin.account.entity.Account;

import java.util.List;
import java.util.NoSuchElementException;

public interface IAccountService {
    Account addNewAccount(Account newAccount);
    Account updateAccountById(int id, Account account);
    void deleteAccountById(int id);
    Account findAccountById(int id) throws NoSuchElementException;
    long getTotalNumberOfRegisteredAccounts();
    List<Account> listAllAccounts();
}
