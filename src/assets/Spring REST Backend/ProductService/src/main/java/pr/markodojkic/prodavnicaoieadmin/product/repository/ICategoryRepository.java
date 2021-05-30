package pr.markodojkic.prodavnicaoieadmin.product.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pr.markodojkic.prodavnicaoieadmin.product.entity.Category;

public interface ICategoryRepository extends JpaRepository<Category, Integer> { }
