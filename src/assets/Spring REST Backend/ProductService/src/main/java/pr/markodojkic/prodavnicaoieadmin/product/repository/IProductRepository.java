package pr.markodojkic.prodavnicaoieadmin.product.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pr.markodojkic.prodavnicaoieadmin.product.entity.Product;

public interface IProductRepository extends JpaRepository<Product, Integer> {
}
