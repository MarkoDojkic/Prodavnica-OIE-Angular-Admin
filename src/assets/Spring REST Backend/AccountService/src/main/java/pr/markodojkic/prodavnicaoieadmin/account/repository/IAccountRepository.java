package pr.markodojkic.prodavnicaoieadmin.account.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pr.markodojkic.prodavnicaoieadmin.account.entity.Account;

public interface IAccountRepository extends JpaRepository<Account, Integer> { }
