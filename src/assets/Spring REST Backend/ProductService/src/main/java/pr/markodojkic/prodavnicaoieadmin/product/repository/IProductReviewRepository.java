package pr.markodojkic.prodavnicaoieadmin.product.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pr.markodojkic.prodavnicaoieadmin.product.entity.ProductReview;
import pr.markodojkic.prodavnicaoieadmin.product.model.ProductReviewCompositePK;

import javax.persistence.EmbeddedId;

public interface IProductReviewRepository extends JpaRepository<ProductReview, ProductReviewCompositePK> {
}
