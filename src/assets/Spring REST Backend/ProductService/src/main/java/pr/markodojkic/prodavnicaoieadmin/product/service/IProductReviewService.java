package pr.markodojkic.prodavnicaoieadmin.product.service;

import pr.markodojkic.prodavnicaoieadmin.product.entity.ProductReview;
import pr.markodojkic.prodavnicaoieadmin.product.model.ProductReviewCompositePK;

import javax.persistence.EmbeddedId;
import java.util.List;

public interface IProductReviewService {
    ProductReview addNewProductReview(ProductReview newProductReview);
    ProductReview updateProductReviewById(ProductReviewCompositePK id, ProductReview newProductReviewData, boolean isNegativeReview);
    void deleteProductReviewById(ProductReviewCompositePK id);
    void deleteAllProductReviewsByAccount(int account_id);
    void deleteAllProductReviewsByProduct(int product_id);
    ProductReview findProductReviewById(ProductReviewCompositePK id);
    long getTotalNumberOfProductReviews();
    int getTotalNumberOfProductReviewsByAccount(int account_id);
    int getTotalNumberOfProductReviewsByProduct(int product_id);
    List<ProductReview> listAllProductReviews();
    List<ProductReview> listAllProductReviewsByAccount(int account_id);
    List<ProductReview> listAllProductReviewsByProduct(int product_id);
}
