package pr.markodojkic.prodavnicaoieadmin.account.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pr.markodojkic.prodavnicaoieadmin.account.entity
        .Account;
import pr.markodojkic.prodavnicaoieadmin.account.repository.IAccountRepository;

import java.util.List;

@Service
public class AccountService implements IAccountService {
    @Autowired
    private IAccountRepository accountRepository;

    @Override
    public Account addNewAccount(Account newAccount) {
        return this.accountRepository.saveAndFlush(newAccount);
    }

    @Override
    public Account updateAccountById(int id, Account newAccountData) {
        Account account = this.findAccountById(id);
        if(account == null) return null;

        if(newAccountData.getName() != null) account.setName(newAccountData.getName());
        if(newAccountData.getSurname() != null) account.setSurname(newAccountData.getSurname());
        if(newAccountData.getPassword_hash() != null) account.setPassword_hash(newAccountData.getPassword_hash());
        if(newAccountData.getEmail() != null) account.setEmail(newAccountData.getEmail());
        if(newAccountData.getPhoneNumber() != null) account.setPhoneNumber(newAccountData.getPhoneNumber());
        if(newAccountData.getMobilePhoneNumber() != null) account.setMobilePhoneNumber(newAccountData.getMobilePhoneNumber());
        if(newAccountData.getDeliveryAddress() != null) account.setDeliveryAddress(newAccountData.getDeliveryAddress());
        if(newAccountData.getDeliveryAddressPAK() != null) account.setDeliveryAddressPAK(newAccountData.getDeliveryAddressPAK());

        return this.addNewAccount(account);
    }

    @Override
    public void deleteAccountById(int id) {
        accountRepository.deleteById(id);
    }

    @Override
    public Account findAccountById(int id) {
        return this.accountRepository.findById(id).isPresent()
          ? this.accountRepository.findById(id).get() : null;
    }

    @Override
    public long getTotalNumberOfRegisteredAccounts() {
        return this.accountRepository.count();
    }

    @Override
    public List<Account> listAllAccounts() {
        return this.accountRepository.findAll();
    }
}
