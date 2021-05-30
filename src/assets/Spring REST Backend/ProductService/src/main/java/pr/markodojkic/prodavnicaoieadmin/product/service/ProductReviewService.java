package pr.markodojkic.prodavnicaoieadmin.product.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pr.markodojkic.prodavnicaoieadmin.product.entity.ProductReview;
import pr.markodojkic.prodavnicaoieadmin.product.model.ProductReviewCompositePK;
import pr.markodojkic.prodavnicaoieadmin.product.repository.IProductReviewRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductReviewService implements IProductReviewService {
    @Autowired
    private IProductReviewRepository productReviewRepository;

    @Override
    public ProductReview addNewProductReview(ProductReview newProductReview) {
        return this.productReviewRepository.saveAndFlush(newProductReview);
    }

    @Override
    public ProductReview updateProductReviewById(ProductReviewCompositePK id, ProductReview newProductReviewData, boolean isNegativeReview) {
        ProductReview productReview = this.findProductReviewById(id);
        if(productReview == null) return null;

        /* Account and Product ids are part of composite key as JPA primary keys and thus cannot be altered, although database permits that
        if(newProductReviewData.getAccount_id() > 0) productReview.setAccount_id(newProductReviewData.getAccount_id());
        if(newProductReviewData.getProduct_id() > 0) productReview.setProduct_id(newProductReviewData.getProduct_id());*/
        if(newProductReviewData.getComment() != null) productReview.setComment(newProductReviewData.getComment());
        if(newProductReviewData.getReview() > 0) productReview.setReview(newProductReviewData.getReview());

        if(isNegativeReview) productReview.setReview(0);

        return this.addNewProductReview(productReview);
    }

    @Override
    public void deleteProductReviewById(ProductReviewCompositePK id) {
        this.productReviewRepository.deleteById(id);
    }

    @Override
    public void deleteAllProductReviewsByAccount(int account_id) {
        this.productReviewRepository.deleteAll(this.listAllProductReviewsByAccount(account_id));
    }

    @Override
    public void deleteAllProductReviewsByProduct(int product_id) {
        this.productReviewRepository.deleteAll(this.listAllProductReviewsByProduct(product_id));
    }

    @Override
    public ProductReview findProductReviewById(ProductReviewCompositePK id) {
        return this.productReviewRepository.findById(id).isPresent()
          ? this.productReviewRepository.findById(id).get() : null;
    }

    @Override
    public long getTotalNumberOfProductReviews() {
        return this.productReviewRepository.count();
    }

    @Override
    public int getTotalNumberOfProductReviewsByAccount(int account_id) {
        return this.listAllProductReviewsByAccount(account_id).size();
    }

    @Override
    public int getTotalNumberOfProductReviewsByProduct(int product_id) {
        return this.listAllProductReviewsByProduct(product_id).size();
    }

    @Override
    public List<ProductReview> listAllProductReviews() {
        return this.productReviewRepository.findAll();
    }

    @Override
    public List<ProductReview> listAllProductReviewsByAccount(int account_id) {
        return this.productReviewRepository.findAll().stream()
                .filter(pr -> pr.getAccount_id() == account_id)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductReview> listAllProductReviewsByProduct(int product_id) {
        return this.productReviewRepository.findAll().stream()
                .filter(pr -> pr.getProduct_id() == product_id)
                .collect(Collectors.toList());
    }
}
